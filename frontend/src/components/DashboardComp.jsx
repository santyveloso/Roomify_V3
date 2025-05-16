import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardComp() {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action === 'Criar Casa') {
      navigate('/create-home-prev');
    } else if (action === 'Inserir Código') {
      navigate('/join-home');
    } else if (action === 'Ver Perfil') {
      navigate('/verperfil');
    } else if (action === 'Criar Tarefa') {
      navigate('/criartarefa');
    } else if (action === 'Criar Despesa') {
      navigate('/criardespesa');
    } else if (action === 'Logout') {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="create-home-wrapper">
      <h1 className="create-home-title">Dashboard</h1>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button className="primary-btn" onClick={() => handleClick('Criar Casa')}>Criar Casa</button>
        <button className="primary-btn" onClick={() => handleClick('Inserir Código')}>Inserir Código</button>
        <button className="primary-btn" onClick={() => handleClick('Ver Perfil')}>Ver Perfil</button>
        <button className="primary-btn" onClick={() => handleClick('Logout')}>Logout</button>
        <button className="primary-btn" onClick={() => handleClick('Criar Tarefa')}>Criar Tarefa</button>
        <button className="primary-btn" onClick={() => handleClick('Criar Despesa')}>Criar Despesa</button>

      </div>
    </div>
  );
}

export default DashboardComp;
