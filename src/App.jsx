import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Ventas from "./pages/Ventas";
import RegistrarVenta from "./pages/RegistrarVenta";
import Prediction from "./pages/Prediction";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css'; // 👈 importa el nuevo CSS

function NavBar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      {user ? (
        <>
          <Link to="/ventas">Ver Ventas</Link>
          <Link to="/registrar-venta">Registrar Venta</Link>
          <Link to="/prediccion">Predicción</Link>
          <Link to="/register">Registrarse</Link>
        </>
      ) : (
        <>
          <Link to="/">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
}
