import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './RegistrarVenta.css';

const RegistrarVenta = () => {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = (parseFloat(cantidad) || 0) * (parseFloat(precio) || 0);

    try {
      await addDoc(collection(db, 'ventas'), {
        producto,
        cantidad: Number(cantidad),
        precio: Number(precio),
        total,
        fecha: Timestamp.now()
      });
      alert("Venta registrada correctamente");
      setProducto('');
      setCantidad('');
      setPrecio('');
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
        <p>Total: S/ {(parseFloat(cantidad) || 0) * (parseFloat(precio) || 0)}</p>
        <button type="submit">Registrar Venta</button>
      </form>
    </div>
  );
};

export default RegistrarVenta;
