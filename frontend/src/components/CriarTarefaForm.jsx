import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CriarTarefaForm = () => {
  const [roomies, setRoomies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
  });
  const [message, setMessage] = useState('');
  const [userHouseId, setUserHouseId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Buscar dados do user (e a sua casa)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8000/backend/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // const houseId = res.data.house?.id || res.data.house_id; // MUDAR PARA IR BUSCAR A CASA ATUAL 
        // if (houseId) {
        //   setUserHouseId(houseId);
        // } else {
        //   setMessage('Erro: não foi possível identificar a casa do utilizador.');
        // }
      } catch (error) {
        console.error('Erro ao buscar utilizador:', error);
        setMessage('Erro ao buscar dados do utilizador.');
      }
    };

    fetchUser();
  }, [token]);

  // Buscar os roomies dessa casa
  useEffect(() => {
    const fetchRoomies = async () => {
      if (!userHouseId) return;
      try {
        const res = await axios.get(`http://localhost:8000/backend/houses/${userHouseId}/roomies/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoomies(res.data);
      } catch (error) {
        console.error('Erro ao buscar roomies:', error);
        setMessage('Erro ao buscar roomies.');
      }
    };

    fetchRoomies();
  }, [userHouseId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userHouseId) {
      setMessage('Casa do utilizador não encontrada.');
      return;
    }

    const payload = {
      ...formData,
      house: userHouseId, // ✅ associar automaticamente à casa
    };

    try {
      await axios.post('http://localhost:8000/backend/tasks/', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Tarefa criada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setMessage('Erro ao criar tarefa.');
    }
  };

  return (
    <div className="task-form-wrapper">
      <h2>Criar Nova Tarefa</h2>

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
          <label>Atribuir a <span style={{ fontWeight: 'normal' }}>(Opcional)</span></label>
          <select name="assigned_to" value={formData.assigned_to} onChange={handleChange}>
            <option value="">Ninguém</option>
            {roomies.map((user) => (
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
