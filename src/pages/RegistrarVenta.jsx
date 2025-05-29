import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './RegistrarVenta.css'; // Asegúrate de crear este archivo

const RegistrarVenta = () => {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);

  const total = (cantidad * precio).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'ventas'), {
        producto,
        cantidad,
        precio,
        total: parseFloat(total),
        fecha: Timestamp.now()
      });
      alert("✅ Venta registrada correctamente");
      setProducto('');
      setCantidad(1);
      setPrecio(0);
    } catch (error) {
      console.error("❌ Error al registrar venta: ", error);
      alert("Error al registrar venta");
    }
  };

  return (
    <div className="registro-container">
      <h2>🧾 Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit} className="formulario-venta">
        <label htmlFor="producto">Producto:</label>
        <select
          id="producto"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          required
        >
          <option value="">-- Selecciona un producto --</option>
          <option value="caño">Caño</option>
          <option value="caja_de_porcelanato">Caja de Porcelanato</option>
          <option value="lavadero">Lavadero</option>
        </select>

        <label htmlFor="cantidad">Cantidad:</label>
        <input
          type="number"
          id="cantidad"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />

        <label htmlFor="precio">Precio (S/):</label>
        <input
          type="number"
          id="precio"
          step="0.01"
          min="0"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
          required
        />

        <p className="total">Total: <strong>S/ {total}</strong></p>

        <button type="submit">Registrar Venta</button>
      </form>
    </div>
  );
};

export default RegistrarVenta;
