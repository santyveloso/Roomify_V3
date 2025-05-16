import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function CreateHomeForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    rules: ''
  });

  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action === 'Criar Casa') {
      navigate('/'); // abre o componente interno
    } else if (action === 'Inserir Código') {
      navigate('/inserir-codigo'); // muda de página
    } else if (action === 'Ver Perfil') {
      navigate('/perfil');
    } else if (action === 'Logout') {
      localStorage.clear(); // ou remove token se necessário
      navigate('/login');
    }
  };

  const [message, setMessage] = useState('');
  const [inviteCode, setInviteCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/houses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer <token>', // Se necessário
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Casa criada com sucesso!');
        setInviteCode(data.invite_code);
        setFormData({
          name: '',
          address: '',
          description: '',
          rules: ''
        });
      } else {
        setMessage('Erro ao criar casa: ' + JSON.stringify(data));
        setInviteCode(null);
      }
    } catch (error) {
      setMessage('Erro na ligação com o servidor.');
      setInviteCode(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Create a New Home</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:<br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label><br /><br />

        <label>
          Address:<br />
          <textarea name="address" value={formData.address} onChange={handleChange} required />
        </label><br /><br />

        <label>
          Description:<br />
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label><br /><br />

        <label>
          Rules:<br />
          <textarea name="rules" value={formData.rules} onChange={handleChange} />
        </label><br /><br />

        <button type="submit">Create Home</button>
      </form>

      <br />
      {message && <p>{message}</p>}

      {inviteCode && (
        <div>
          <p><strong>Invite Code:</strong> {inviteCode}</p>
          <button onClick={copyToClipboard}>
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      )}
    </div>
  );
}


export default CreateHomeForm;