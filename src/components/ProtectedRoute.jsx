import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red" }}>
          Error: Usted no se encuentra logueado. Por favor, inicie sesión o regístrese.
        </p>
        <a href="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Ir a Registrarse
        </a>
      </div>
    );
  }

  return <Outlet />;
}
