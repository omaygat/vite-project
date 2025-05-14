import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Dashboard</h1>
      <p>Bienvenido a la Predicción de Ventas de Inodoros Trébol Rapiet</p>
      <nav style={{ marginTop: '20px' }}>
        <Link to="/ventas" style={{ marginRight: '20px' }}>Ver Data de Ventas</Link>
        <Link to="/">Cerrar Sesión</Link>
      </nav>
    </div>
  );
}

export default Dashboard;
