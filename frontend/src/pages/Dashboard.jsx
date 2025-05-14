import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateHomeForm from '../components/CreateHomeForm';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action === 'Criar Casa') {
      navigate('create-home');
    } else if (action === 'Inserir Código') {
      navigate('/join-home');
    } else if (action === 'Ver Perfil') {
      navigate('/perfil');
    } else if (action === 'Logout') {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', padding: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>Dashboard</h1>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button onClick={() => handleClick('Criar Casa')}>Criar Casa</button>
        <button onClick={() => handleClick('Inserir Código')}>Inserir Código</button>
        <button onClick={() => handleClick('Ver Perfil')}>Ver Perfil</button>
        <button onClick={() => handleClick('Logout')}>Logout</button>
      </div>
    </div>
  );
}
