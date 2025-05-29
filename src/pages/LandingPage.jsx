import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '80vh', gap: '20px' 
    }}>
      <h1>Bienvenido</h1>
      <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', fontSize: '18px' }}>Iniciar Sesión</button>
      <button onClick={() => navigate('/register')} style={{ padding: '10px 20px', fontSize: '18px' }}>Registrarse</button>
    </div>
  );
};

export default LandingPage;
