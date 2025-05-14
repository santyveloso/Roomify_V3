import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento após login

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  // Definição da função handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      password: password1,
    };

    try {
      // Enviar o formulário para a API de login
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.key);
        localStorage.setItem('userType', result.user_type);        setMessage('Login bem-sucedido!');
        // Redireciona para a página desejada após login
        if (result.user_type === 'leader') {
          navigate('/dashboard-leader');
        } else {
          navigate('/dashboard-roomie');
        }      } 
        else {
          let errorMsg = 'Ocorreu um erro no login.';
        if (result && typeof result === 'object') {
          errorMsg = Object.values(result).flat().join(' ');
        }
        setMessage(errorMsg);
      }
    } catch (error) {
      setMessage('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="login-form">
      <h2>Entrar na sua Conta de utilizador</h2>
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
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
        </div>

        <button type="submit">Entrar</button>
      </form>
      {message && <p>{message}</p>} {/* Exibe a mensagem de sucesso ou erro */}
    </div>
  );
};

export default LoginForm;
