from flask import Flask, jsonify
from flask_cors import CORS
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
from datetime import datetime
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)
CORS(app)

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
    ventas_ref = db.collection('ventas')
    docs = ventas_ref.stream()

    data = []
    for doc in docs:
        venta = doc.to_dict()
        fecha = venta.get('fecha', None)
        data.append({
            'fecha': fecha,
            'producto': venta.get('producto', ''),
            'cantidad': float(venta.get('cantidad', 0)),
            'precio': float(venta.get('precio', 0)),
            'total': float(venta.get('total', 0))
        })

    df = pd.DataFrame(data)
    df['fecha'] = pd.to_datetime(df['fecha'], errors='coerce')
    df = df.dropna(subset=['fecha'])  # Asegúrate de no tener fechas vacías

    df['mes'] = df['fecha'].dt.to_period('M')
    df_mes = df.groupby('mes', as_index=False).agg({
        'total': 'sum',
        'cantidad': 'sum'
    })

    df_mes['mes_numero'] = np.arange(len(df_mes))

    # Modelo para ventas en soles
    X = df_mes[['mes_numero']]
    y_ventas = df_mes['total']
    model_ventas = LinearRegression().fit(X, y_ventas)
    pred_ventas = model_ventas.predict([[df_mes['mes_numero'].max() + 1]])

    # Modelo para cantidad de unidades
    y_cantidad = df_mes['cantidad']
    model_cantidad = LinearRegression().fit(X, y_cantidad)
    pred_cantidad = model_cantidad.predict([[df_mes['mes_numero'].max() + 1]])

    resultado = {
        'fecha_prediccion': datetime.now().strftime('%Y-%m-%d'),
        'prediccion_ventas': float(pred_ventas[0]),
        'prediccion_cantidad': int(round(pred_cantidad[0]))
    }

    # Guardar en Firestore también (opcional)
    db.collection('predicciones').document('proximo_mes').set(resultado)

    return jsonify(resultado)

# Render config
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
