import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardAdminComp() {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action === 'Criar Casa') {
      navigate('/create-home-prev');
    }
  };

  return (
    <div className="create-home-wrapper">
      <h1 className="create-home-title">Dashboard do Admin</h1>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button className="primary-btn" onClick={() => handleClick('Criar Casa')}>Criar Casa</button>
        <button className="primary-btn" onClick={() => handleClick('Logout')}>Logout</button>

      </div>
    </div>
  );
}

export default DashboardAdminComp;
