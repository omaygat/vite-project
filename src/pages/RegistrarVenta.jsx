// src/pages/RegistrarVenta.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const RegistrarVenta = () => {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = cantidad * precio;

    try {
      await addDoc(collection(db, 'ventas'), {
        producto,
        cantidad,
        precio,
        total,
        fecha: Timestamp.now()
      });
      alert("Venta registrada correctamente");
      setProducto('');
      setCantidad(1);
      setPrecio(0);
    } catch (error) {
      console.error("Error al registrar venta: ", error);
    }
  };

  return (
    <div>
      <h2>Registrar Nueva Venta 📝</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Producto"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
          required
        />
        <p>Total: {cantidad * precio}</p>
        <button type="submit">Registrar Venta</button>
      </form>
    </div>
  );
};

export default RegistrarVenta;