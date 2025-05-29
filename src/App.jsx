import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Ventas from "./pages/Ventas";
import RegistrarVenta from "./pages/RegistrarVenta";
import Prediction from "./pages/Prediction";
import ProtectedRoute from "./components/ProtectedRoute";

function NavBar() {
  const { user } = useContext(AuthContext);

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {user ? (
        <>
          <Link to="/ventas" style={{ marginRight: "15px" }}>Ventas</Link>
          <Link to="/registrar-venta" style={{ marginRight: "15px" }}>Registrar Venta</Link>
          <Link to="/prediccion" style={{ marginRight: "15px" }}>Predicción de Ventas</Link>
          <Link to="/Register" style={{ marginRight: "15px" }}>Registrarse </Link>
        </>
      ) : (
        <>
          <Link to="/" style={{ marginRight: "15px" }}>Login</Link>
          <Link to="/register" style={{ marginRight: "15px" }}>Registrarse</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/registrar-venta" element={<RegistrarVenta />} />
            <Route path="/prediccion" element={<Prediction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
