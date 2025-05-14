const functions = require("firebase-functions");
const axios = require("axios");

// Función para realizar la predicción
exports.predictSales = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send('Método no permitido');
  }

  try {
    const { ventasData } = req.body;  // Datos que le pasamos desde la app (ventas actuales)

    // Enviar los datos a Google Colab para la predicción
    const response = await axios.post('https://colab.research.google.com/drive/19t5n4OjAXWDqclblftedbCjcP6JDGfl-?usp=sharing', {
      data: ventasData  // Aquí se pasan los datos a predecir (puedes ajustar este formato según lo que necesites)
    });

    // Procesar la respuesta y devolverla
    const predictionResult = response.data;

    // Devolver la predicción al cliente
    return res.status(200).send({ prediction: predictionResult });
  } catch (error) {
    console.error('Error al hacer la predicción:', error);
    return res.status(500).send('Error en la predicción');
  }
});
