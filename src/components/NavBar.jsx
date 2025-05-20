import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function NavBar() {
  const { user } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {user ? (
        <>
          <Link to="/registrar-venta" style={{ marginRight: "15px" }}>Registrar Venta</Link>
          <Link to="/ventas" style={{ marginRight: "15px" }}>Ventas</Link>
          <Link to="/prediccion" style={{ marginRight: "15px" }}>Predicción de Ventas</Link>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "15px" }}>Login</Link>
          <Link to="/register" style={{ marginRight: "15px" }}>Registrarse</Link>
        </>
      )}
    </nav>
  );
}
