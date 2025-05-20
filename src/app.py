from flask import Flask, jsonify
from flask_cors import CORS  # 👈 agregar esta línea
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
from datetime import datetime
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)
CORS(app)  # 👈 permitir peticiones desde cualquier origen

# Inicializar Firebase...

# Inicializar Firebase
if not firebase_admin._apps:
    firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
    if not firebase_credentials:
        raise ValueError("La variable de entorno FIREBASE_CREDENTIALS no está definida.")
    cred_dict = json.loads(firebase_credentials)
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/prediccion', methods=['GET'])
def predecir_ventas():
    # Recuperar datos de Firestore
    ventas_ref = db.collection('ventas')
    docs = ventas_ref.stream()
    data = []
    for doc in docs:
        venta = doc.to_dict()
        fecha = venta.get('fecha', None)
        data.append({
            'fecha': fecha,
            'producto': venta.get('producto', ''),
            'cantidad': venta.get('cantidad', 0),
            'precio': venta.get('precio', 0),
            'total': venta.get('total', 0)
        })

    df = pd.DataFrame(data)
    df['fecha'] = pd.to_datetime(df['fecha'], errors='coerce')
    df['mes'] = df['fecha'].dt.to_period('M')
    df_mes = df.groupby(['mes'], as_index=False).agg({'total': 'sum'})
    df_mes['mes_numero'] = np.arange(len(df_mes))
    X = df_mes[['mes_numero']]
    y = df_mes['total']

    model = LinearRegression()
    model.fit(X, y)
    proximo_mes = np.array([[df_mes['mes_numero'].max() + 1]])
    prediccion = model.predict(proximo_mes)

    # Guardar en Firestore
    prediccion_ref = db.collection('predicciones').document('proximo_mes')
    prediccion_ref.set({
        'fecha_prediccion': datetime.now().strftime('%Y-%m-%d'),
        'prediccion_ventas': float(prediccion[0])
    })

    return jsonify({
        'prediccion': float(prediccion[0]),
        'fecha_prediccion': datetime.now().strftime('%Y-%m-%d')
    })

# Especificar puerto para Render
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Render detecta este puerto
    app.run(host='0.0.0.0', port=port)
