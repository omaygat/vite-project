// src/pages/Ventas.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({ producto: '', cantidad: '', precio: '' });

  useEffect(() => {
    const fetchVentas = async () => {
      const q = collection(db, 'ventas');
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ventasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVentas(ventasData);
      });
      return () => unsubscribe();
    };

    fetchVentas();
  }, []);

  const eliminarVenta = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta venta?")) {
      await deleteDoc(doc(db, 'ventas', id));
    }
  };

  const iniciarEdicion = (venta) => {
    setEditandoId(venta.id);
    setEditData({
      producto: venta.producto,
      cantidad: venta.cantidad,
      precio: venta.precio
    });
  };

  const guardarCambios = async () => {
    const total = Number(editData.precio) * Number(editData.cantidad);
    await updateDoc(doc(db, 'ventas', editandoId), {
      ...editData,
      cantidad: Number(editData.cantidad),
      precio: Number(editData.precio),
      total
    });
    setEditandoId(null);
  };

 const ventasFiltradas = ventas.filter(venta => {
  const producto = venta.producto || ""; // Si es undefined, lo reemplaza con cadena vacía
  const nombreCoincide = producto.toLowerCase().includes(filtro.toLowerCase());
  const fechaVenta = venta.fecha?.toDate();
  const desde = fechaDesde ? new Date(fechaDesde) : null;
  const hasta = fechaHasta ? new Date(fechaHasta) : null;
  const fechaCoincide = (!desde || fechaVenta >= desde) && (!hasta || fechaVenta <= hasta);
  return nombreCoincide && fechaCoincide;
});


  const exportarExcel = () => {
    const datosExportar = ventasFiltradas.map(venta => ({
      Producto: venta.producto,
      Cantidad: venta.cantidad,
      Precio: venta.precio,
      Total: venta.total,
      Fecha: venta.fecha?.toDate().toLocaleString()
    }));
    const worksheet = XLSX.utils.json_to_sheet(datosExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "ventas.xlsx");
  };

  // Agrupar ventas por mes y calcular el total de ventas por mes
  const ventasPorMes = () => {
    const grouped = ventas.reduce((acc, venta) => {
      const fechaVenta = venta.fecha?.toDate();
      const mes = fechaVenta ? `${fechaVenta.getMonth() + 1}/${fechaVenta.getFullYear()}` : 'Desconocido';
      if (!acc[mes]) {
        acc[mes] = 0;
      }
      acc[mes] += venta.total;
      return acc;
    }, {});

    // Convertir el objeto agrupado en un array para la gráfica
    return Object.keys(grouped).map(mes => ({
      mes,
      total: grouped[mes]
    }));
  };

  const dataGrafico = ventasPorMes();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Ventas Registradas 📋</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        <button onClick={exportarExcel}>📥 Exportar a Excel</button>
      </div>

      {ventasFiltradas.length === 0 ? (
        <p>No hay ventas que coincidan con la búsqueda.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.map((venta) => (
              <React.Fragment key={venta.id}>
                <tr>
                  <td>{venta.producto}</td>
                  <td>{venta.cantidad}</td>
                  <td>{venta.precio}</td>
                  <td>{venta.total}</td>
                  <td>{venta.fecha?.toDate().toLocaleString()}</td>
                  <td>
                    <button onClick={() => iniciarEdicion(venta)}>✏️</button>
                    <button onClick={() => eliminarVenta(venta.id)}>🗑</button>
                  </td>
                </tr>
                {editandoId === venta.id && (
                  <tr>
                    <td colSpan="6">
                      <form onSubmit={(e) => { e.preventDefault(); guardarCambios(); }}>
                        <input
                          type="text"
                          value={editData.producto}
                          onChange={(e) => setEditData({ ...editData, producto: e.target.value })}
                          required
                        />
                        <input
                          type="number"
                          value={editData.cantidad}
                          onChange={(e) => setEditData({ ...editData, cantidad: e.target.value })}
                          required
                        />
                        <input
                          type="number"
                          value={editData.precio}
                          onChange={(e) => setEditData({ ...editData, precio: e.target.value })}
                          required
                        />
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
                      </form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      <h2>Gráfico de Ventas por Mes</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Total Vendido" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Ventas;
