import React, { useState } from 'react';
import axios from 'axios';

const CriarPostForm = ({ houseId, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isAviso, setIsAviso] = useState(false);
  const [message, setMessage] = useState('');

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

    console.log("Post criado com sucesso:", response.data); // 👈 DEBUG aqui

    setContent('');
    setIsAviso(false);
    setMessage('✅ Post criado com sucesso!');

    if (onPostCreated) onPostCreated(); // 👈 só chama se estiver definido
  } catch (err) {
    console.error("Erro ao criar post:", err); // 👈 DEBUG do erro real
    setMessage('❌ Erro ao criar o post.');
  }
  };

 return (
  <div className="task-form-wrapper">
    <h2>Criar Post</h2> {/* usa <h2> para alinhar com o estilo */}
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
