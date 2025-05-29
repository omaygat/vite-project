import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Prediction.css';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const Prediction = () => {
  const [prediccion, setPrediccion] = useState(null);

  const obtenerNombreMesSiguiente = (fechaStr) => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fecha = new Date(fechaStr);
    const mesSiguiente = (fecha.getMonth() + 1) % 12; // Si diciembre, vuelve a enero (0)
    return meses[mesSiguiente];
  };

  const dataGrafica = prediccion ? [
    {
      mes: obtenerNombreMesSiguiente(prediccion.fecha_prediccion),
      ventas: prediccion.prediccion_ventas
    }
  ] : [];

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
    <div className="page">
      <div className="card">
        <h2 className="title">📊 Predicción de Ventas</h2>
        {prediccion ? (
          <>
            <div className="content">
              <p><strong>Fecha de predicción:</strong> <span className="value">{prediccion.fecha_prediccion}</span></p>
              <p>
                <strong>Ventas estimadas para el próximo mes:</strong> 
                <span className="value">
                  {prediccion.prediccion_ventas !== undefined ? ` S/ ${prediccion.prediccion_ventas.toFixed(2)}` : ' No disponible'}
                </span>
              </p>
              <p>
                <strong>Cantidad estimada de unidades a vender:</strong> 
                <span className="value">
                  {prediccion.prediccion_cantidad !== undefined ? ` ${Math.round(prediccion.prediccion_cantidad)}` : ' No disponible'}
                </span>
              </p>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dataGrafica} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ventas" stroke="#2980b9" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="loading">⏳ Cargando predicción...</p>
        )}
      </div>
    </div>
  );
};

export default Prediction;
