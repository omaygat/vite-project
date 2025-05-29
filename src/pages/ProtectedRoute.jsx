// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);

  // Si no hay usuario, redirige a la página de login
  if (!user) {
    return <Navigate to="/" />;
  }

  // Si hay usuario, muestra la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;
