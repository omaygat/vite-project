// App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ventas from "./pages/Ventas";
import RegistrarVenta from "./pages/RegistrarVenta";
import Prediction from "./pages/Prediction";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Login</Link> | 
        <Link to="/register">Registrarse</Link> | 
        <Link to="/ventas">Ventas</Link> |  
        <Link to="/registrar-venta">Registrar Venta</Link> | 
        <Link to="/prediccion">Predicción de Ventas</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/registrar-venta" element={<RegistrarVenta />} />
        <Route path="/prediccion" element={<Prediction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;