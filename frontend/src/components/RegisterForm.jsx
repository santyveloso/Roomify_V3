import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function getCSRFToken() {
  return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
}

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [phone, setPhone] = useState('');
  const [profile_picture, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(''); // pra ver a foto escolhida
  const [user_type, setUserType] = useState('ROOMIE'); // ADICIONADO
  const [message, setMessage] = useState(''); // Para mostrar mensagens
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se as senhas são iguais
    if (password !== password2) {
      setMessage('As senhas não coincidem!');
      return;
    }



    try {

      // pra termos profilepic temos q usar o formdata
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('user_type', user_type);
      if (phone) formData.append('phone', phone);
      if (profile_picture) formData.append('profile_picture', profile_picture);


      const response = await axios.post(
        'http://localhost:8000/backend/users/signup/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': getCSRFToken(),
          },
          withCredentials: true,
        }
      );

      setMessage('Registo bem-sucedido! Já podes fazer Login :)');
      navigate('/login'); // redireciona pro login

    } catch (error) {
      if (error.response && error.response.data) {
        // Mostra mensagens de erro que vêm da API
        setMessage(JSON.stringify(error.response.data));
      } else {
        setMessage('Erro ao registar. Tente novamente.');
      }
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setProfilePic(null);
      setPreviewUrl('');
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
            value={user_type}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="ADMIN">Dono da casa</option>
            <option value="ROOMIE">Roomie</option>
          </select>
        </div>
        <div>
          <label>Telemóvel</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}

          />
        </div>
        <div>
          <label>Foto de Perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {previewUrl && <img src={previewUrl} alt="Preview" height="100px" />}

        <button type="submit">Registar</button>
        <Link to='/login'>Já tens conta? Clica aqui para fazer login</Link>
      </form>
      {message && <p>{message}</p>} {/* Exibe a mensagem de sucesso ou erro */}
    </div>
  );
}

export default RegisterForm;