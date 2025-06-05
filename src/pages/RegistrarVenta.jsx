import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './RegistrarVenta.css';

const RegistrarVenta = () => {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [oferta, setOferta] = useState(false);
  const [rebajaPromedio, setRebajaPromedio] = useState('');
  const [indiceMercado, setIndiceMercado] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = (parseFloat(cantidad) || 0) * (parseFloat(precio) || 0);

    try {
      await addDoc(collection(db, 'ventas'), {
        producto,
        cantidad: Number(cantidad),
        precio: Number(precio),
        total,
        fecha: Timestamp.now(),
        oferta: oferta ? 1 : 0,
        rebaja_promedio: parseFloat(rebajaPromedio) || 0,
        indice_mercado: parseFloat(indiceMercado) || 100 // Puedes ajustar el valor por defecto
      });
      alert("Venta registrada correctamente");
      setProducto('');
      setCantidad('');
      setPrecio('');
      setOferta(false);
      setRebajaPromedio('');
      setIndiceMercado('');
    } catch (error) {
      console.error("Error al registrar venta: ", error);
    }
  };

  return (
    <div className="registro-container">
      <h2>Registrar Nueva Venta 📝</h2>
      <form onSubmit={handleSubmit}>
        <select value={producto} onChange={(e) => setProducto(e.target.value)} required>
          <option value="">Seleccione un producto</option>
          <option value="Caño">Caño</option>
          <option value="Caja de porcelanato">Caja de porcelanato</option>
          <option value="Lavadero">Lavadero</option>
        </select>

        <input
          type="number"
          placeholder="Cantidad a comprar"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min="1"
          step="1"
          required
        />

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          min="0"
          step="0.01"
          required
        />

        {/* NUEVOS CAMPOS */}
        <label>
          <input
            type="checkbox"
            checked={oferta}
            onChange={(e) => setOferta(e.target.checked)}
          />
          ¿Hubo oferta?
        </label>

        <input
          type="number"
          placeholder="Rebaja promedio (%)"
          value={rebajaPromedio}
          onChange={(e) => setRebajaPromedio(e.target.value)}
          min="0"
          max="100"
          step="0.1"
        />

        <input
          type="number"
          placeholder="Índice del mercado"
          value={indiceMercado}
          onChange={(e) => setIndiceMercado(e.target.value)}
          min="0"
          step="0.1"
        />

        <p>Total: S/ {(parseFloat(cantidad) || 0) * (parseFloat(precio) || 0)}</p>

        <button type="submit">Registrar Venta</button>
      </form>
    </div>
  );
};

export default RegistrarVenta;

