import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardRoomieComp() {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action === 'Inserir Código') {
      navigate('/join-home');
    }
  };

  return (
    <div className="create-home-wrapper">
      <h1 className="create-home-title">Dashboard do Roomie </h1>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button className="primary-btn" onClick={() => handleClick('Inserir Código')}>Inserir Código</button>
        <button className="primary-btn" onClick={() => handleClick('Logout')}>Logout</button>

      </div>
    </div>
  );
}

export default DashboardRoomieComp;
