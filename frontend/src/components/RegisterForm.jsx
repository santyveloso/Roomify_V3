import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [userType, setUserType] = useState('roomie'); // ADICIONADO
  const [message, setMessage] = useState(''); // Para mostrar mensagens


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se as senhas são iguais
    if (password !== password2) {
      setMessage('As senhas não coincidem!');
      return;
    }

    const data = {
        username,
        email,
        password,
        user_type: userType  // ADICIONADO
    };
    try {
        // Enviar o formulário para a API de registo (ajuste o URL conforme necessário)
        const response = await fetch('http://localhost:8000/backend/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          setMessage('Registo bem-sucedido! Já podes fazer Login :)');
        } else {
          console.log(result);
          let errorMsg = 'Ocorreu um erro no registo.';
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
      <div className='register-form '>
        <h2>Registar Novo Utilizador</h2>
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
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
          <div>
          <label>Tipo de Utilizador</label>
          <select 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)} 
            required
          >
            <option value="leader">Dono da casa</option>
            <option value="roomie">Roomie</option>
          </select>
          </div>
          
          <button type="submit">Registar</button>
          <Link to='/login'>Já tens conta? Clica aqui para fazer login</Link>
        </form>
        {message && <p>{message}</p>} {/* Exibe a mensagem de sucesso ou erro */}
      </div>
    );
  }
  
  export default RegisterForm;