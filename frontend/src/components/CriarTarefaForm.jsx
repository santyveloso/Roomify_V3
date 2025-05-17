import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CriarTarefaForm = ({ houseId, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    category: '',
  });
  const [roomies, setRoomies] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const BASE_URL = `http://localhost:8000/backend/houses/${houseId}/tasks/`;
  const BASE_URL_MEMBERS = `http://localhost:8000/backend/houses/${houseId}/members/`;

  useEffect(() => {
    axios.get(BASE_URL_MEMBERS, { withCredentials: true })
      .then(res => setRoomies(res.data))
      .catch(() => setMessage('Erro ao carregar membros da casa.'));
  }, [houseId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCSRFToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(BASE_URL, {
        ...formData,
        house: houseId,
        assigned_to: formData.assigned_to || null,
      }, {
        headers: { 'X-CSRFToken': getCSRFToken() },
        withCredentials: true,
      });
      if (onTaskCreated) onTaskCreated();
      setMessage('Tarefa criada com sucesso!');
    } catch {
      setMessage('Erro ao criar tarefa.');
    }
  };

  return (
    <div className="task-form-wrapper">
      <h2>Criar Nova Tarefa</h2>

      <button className="primary-btn" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        ← Voltar
      </button>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div>
          <label>Descrição</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div>
          <label>Categoria</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Selecione uma categoria</option>
            <option value="limpeza">Limpeza</option>
            <option value="manutenção">Manutenção</option>
            <option value="compras">Compras</option>
          </select>
        </div>

        <div>
          <label>Atribuir a <span style={{ fontWeight: 'normal' }}>(Opcional)</span></label>
          <select name="assigned_to" value={formData.assigned_to} onChange={handleChange}>
            <option value="">Ninguém</option>
            {roomies.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Data Limite</label>
          <input type="datetime-local" name="due_date" value={formData.due_date} onChange={handleChange} />
        </div>

        <button type="submit" className="primary-btn">Criar Tarefa</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default CriarTarefaForm;
