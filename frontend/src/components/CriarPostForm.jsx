import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CriarPostForm = ({ houseId, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isAviso, setIsAviso] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // para retroceder

  const getCSRFToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8000/backend/houses/${houseId}/posts/`, {
        content,
        is_aviso: isAviso
      }, {
        withCredentials: true,
        headers: { 'X-CSRFToken': getCSRFToken() }
      });

      console.log("Post criado com sucesso:", response.data);

      setContent('');
      setIsAviso(false);
      setMessage('✅ Post criado com sucesso!');

      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Erro ao criar post:", err);
      setMessage('❌ Erro ao criar o post.');
    }
  };

  return (
    <div className="task-form-wrapper">
      <button
        onClick={() => navigate(-1)}
        style={{
          alignSelf: 'flex-start',
          marginBottom: '1rem',
          background: 'none',
          border: 'none',
          color: 'var(--primary-color)',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        ← Voltar
      </button>

      <h2>Criar Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Conteúdo</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div>
          <label>
            <input type="checkbox" checked={isAviso} onChange={e => setIsAviso(e.target.checked)} />
            Aviso (destaque)
          </label>
        </div>
        <button className="primary-btn" type="submit">Publicar</button>
        {message && (
          <p className="form-message" style={{ color: message.includes('sucesso') ? 'green' : 'darkred' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CriarPostForm;
