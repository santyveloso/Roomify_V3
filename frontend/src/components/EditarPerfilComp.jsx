// isto n ta a ser usado?

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditarPerfil = () => {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
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
          navigate('/ups');
        }
      } catch (error) {
        console.error(error);
        navigate('/ups');
      }
    };

    fetchUserData();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser((prev) => ({ ...prev, profile_picture: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('phone', user.phone || '');
    if (user.profile_picture instanceof File) {
      formData.append('profile_picture', user.profile_picture);
    }

    try {
      const response = await fetch(`http://localhost:8000/backend/users/${user.id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMessage('Perfil atualizado com sucesso!');
        navigate('/verperfil');
      } else {
        const result = await response.json();
        const errorMsg = Object.values(result).flat().join(' ');
        setMessage(errorMsg);
      }
    } catch (error) {
      console.error(error);
      setMessage('Erro ao atualizar perfil.');
    }
  };

  if (!user) return <p className="create-or-join-title">A carregar...</p>;

  return (
    <div className="create-or-join-wrapper">
      <h2 className="create-or-join-title">Editar Perfil</h2>

      <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={user.username} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Telemóvel</label>
          <input type="text" name="phone" value={user.phone || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Foto de Perfil</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {(preview || user.profile_picture) ? (
          <img
            className="profile-preview"
            src={preview || `http://localhost:8000${user.profile_picture}`}
            alt="Preview"
          />
        ) : (
          <p className="no-photo-text">Sem foto</p>
        )}

        <button type="submit" className="primary-btn">
          Guardar Alterações
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default EditarPerfil;
