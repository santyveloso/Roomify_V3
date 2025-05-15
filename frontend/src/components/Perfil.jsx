import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
       const response = await fetch('http://localhost:8000/backend/users/me/', {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });


        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          throw new Error('Falha ao obter utilizador');
        }
      } catch (error) {
        console.error(error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <p style={{ textAlign: 'center' }}>A carregar perfil...</p>;
  if (!user) return null;

  return (
    <div className="create-or-join-wrapper">
      <h2 className="create-or-join-title">Perfil do Utilizador</h2>
      <div className="house-switcher">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            {user.profile_picture ? (
              <img
                src={`http://localhost:8000${user.profile_picture}`}
                alt="Foto de Perfil"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--border-color)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--light-text)',
                  fontSize: '14px',
                  margin: '0 auto',
                }}
              >
                Sem Foto
              </div>
            )}
          </div>

          <p><strong>Nome de Utilizador:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tipo de Utilizador:</strong> {user.user_type}</p>
          <p><strong>Telemóvel:</strong> {user.phone || <span style={{ color: 'var(--light-text)' }}>Por preencher</span>}</p>
        </div>

        <button
          className="primary-btn"
          style={{ marginTop: '1rem', width: '100%' }}
          onClick={() => navigate('/editarperfil')}
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
