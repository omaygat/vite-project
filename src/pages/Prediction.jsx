import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Prediction = () => {
  const [prediccion, setPrediccion] = useState(null);

  useEffect(() => {
    const fetchPrediccion = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/prediccion`);
        setPrediccion(response.data);
      } catch (error) {
        console.error('Error al obtener la predicción:', error);
      }
    };

    fetchPrediccion();
  }, []);

  return (
    <div>
      <h2>📊 Predicción de Ventas</h2>
      {prediccion ? (
        <div>
          <p><strong>Fecha de predicción:</strong> {prediccion.fecha_prediccion}</p>
          <p><strong>Ventas estimadas para el próximo mes:</strong> 
            {prediccion.prediccion_ventas !== undefined ? ` S/ ${prediccion.prediccion_ventas.toFixed(2)}` : ' No disponible'}
          </p>
          <p><strong>Cantidad estimada de unidades a vender:</strong> 
            {prediccion.cantidad_estimada !== undefined ? ` ${Math.round(prediccion.cantidad_estimada)}` : ' No disponible'}
          </p>
        </div>
      ) : (
        <p>⏳ Cargando predicción...</p>
      )}
    </div>
  );
};

export default Prediction;
