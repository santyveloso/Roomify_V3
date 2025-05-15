import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionamento após login
import { Link } from 'react-router-dom';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  // Definição da função handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password: password1,
    };

    try {
      // Enviar o formulário para a API de login
      const response = await fetch('http://localhost:8000/backend/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.access);
        localStorage.setItem('userType', result.user_type);        
        setMessage('Login bem-sucedido!');
        // Redireciona para a página desejada após login
        navigate('/dashboard');

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
          <label>E-mail</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
