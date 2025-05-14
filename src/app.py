import os
import json
from io import StringIO
from flask import Flask, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Obtener el JSON desde la variable de entorno
firebase_json = os.environ.get("FIREBASE_CREDENTIALS")

if not firebase_json:
    raise ValueError("La variable de entorno FIREBASE_CREDENTIALS no está definida.")

# Convertir el JSON (cadena) a un diccionario
cred_dict = json.load(StringIO(firebase_json))
cred = credentials.Certificate(cred_dict)

# Inicializar Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()
