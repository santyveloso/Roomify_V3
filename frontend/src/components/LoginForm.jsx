import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento após login
import { Link } from 'react-router-dom';
import axios from 'axios';


const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para navegação



  function getCSRFToken() {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
  }

  // Definição da função handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password: password,
    };


    // Enviar o formulário para a API de login

    try {
      const response = await axios.post(
        'http://localhost:8000/backend/users/login/',
        {
          username,
          password: password,
        },
        {
          headers: { 'X-CSRFToken': getCSRFToken() },
          withCredentials: true
        }
      );

      // Sucesso
      setMessage('Login bem-sucedido!');
      
      // 2. Vai buscar o perfil
      const profileRes = await axios.get('http://localhost:8000/backend/users/profile/', {
        withCredentials: true,
      });

      const userType = profileRes.data.user_type;
      const house = profileRes.data.house;
      const houseId = house?.id;

      // 3. Redirecionamento conforme tipo de utilizador
      if (userType === 'ADMIN') {
        if (houseId) {
          navigate(`/houses/${houseId}`);
        } else {
          navigate('/dashboard-admin');
        }
      } else if (userType === 'ROOMIE') {
        if (houseId) {
          navigate(`/houses/${houseId}/roomie`);
        } else {
          navigate('/dashboard-roomie');
        }
      } else {
        setMessage('Tipo de utilizador desconhecido.');
      }
  
    } catch (error) {
      if (error.response && error.response.data) {
        const result = error.response.data;
        let errorMsg = 'Erro no login.';
        if (typeof result === 'object') {
          errorMsg = Object.values(result).flat().join(' ');
        }
        setMessage(errorMsg);
      } else {
        setMessage('Erro ao conectar ao servidor.');
      }
    }

  };

  return (
    <div className="login-form">
      <h2>Entrar na sua Conta de Utilizador</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>


        <div className="button-container">
          <button type="submit">Entrar</button>
        </div>

      </form>
      {message && <p>{message}</p>} {/* Exibe a mensagem de sucesso ou erro */}
    </div>
  );
};

export default LoginForm;
