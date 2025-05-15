import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CriarDespesaForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: '',
  });
  const [assignedRoomies, setAssignedRoomies] = useState([]);
  const [roomies, setRoomies] = useState([]);
  const [houseId, setHouseId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Buscar dados do utilizador para obter a casa
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8000/backend/users/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const casa = res.data.house?.id || res.data.house_id;
        if (casa) setHouseId(casa);
        else setMessage('Não foi possível identificar a casa atual.');
      } catch (error) {
        setMessage('Erro ao carregar utilizador.');
      }
    };
    fetchUser();
  }, [token]);

  // Buscar os roomies da casa
  useEffect(() => {
    const fetchRoomies = async () => {
      if (!houseId) return;
      try {
        const res = await axios.get(`http://localhost:8000/backend/houses/${houseId}/roomies/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoomies(res.data);
        setAssignedRoomies(res.data.map(u => ({ user: u.id, amount_due: '' })));
      } catch (error) {
        console.error('Erro ao buscar roomies:', error);
      }
    };
    fetchRoomies();
  }, [houseId, token]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomieChange = (index, value) => {
    const newShares = [...assignedRoomies];
    newShares[index].amount_due = value;
    setAssignedRoomies(newShares);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = parseFloat(formData.amount);
    const somaShares = assignedRoomies.reduce((acc, s) => acc + parseFloat(s.amount_due || 0), 0);

    if (total !== somaShares) {
      setMessage('A soma dos valores atribuídos não bate com o total.');
      return;
    }

    const payload = {
      ...formData,
      house: houseId,
      assigned_roomies: assignedRoomies,
    };

    try {
      await axios.post('http://localhost:8000/backend/expenses/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Despesa criada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setMessage('Erro ao criar despesa.');
    }
  };

  return (
    <div className="create-or-join-wrapper">
      <h2 className="create-or-join-title">Criar Despesa</h2>

      <form onSubmit={handleSubmit} className="house-switcher">
        <label>Título</label>
        <input name="title" value={formData.title} onChange={handleFormChange} required />

        <label>Valor Total (€)</label>
        <input type="number" name="amount" step="0.01" value={formData.amount} onChange={handleFormChange} required />

        <label>Data</label>
        <input type="date" name="date" value={formData.date} onChange={handleFormChange} required />

        <label>Categoria</label>
        <input name="category" value={formData.category} onChange={handleFormChange} required />

        <label>Descrição</label>
        <textarea name="description" value={formData.description} onChange={handleFormChange} />

        <label>Divisão entre Roomies</label>
        {Array.isArray(roomies) && roomies.map((r, i) => (
        <div key={r.id} style={{ marginBottom: '10px' }}>
            <strong>{r.username}</strong> – €{' '}
            <input
            type="number"
            step="0.01"
            value={assignedRoomies[i]?.amount_due || ''}
            onChange={(e) => handleRoomieChange(i, e.target.value)}
            required
            />
        </div>
        ))}


        <button type="submit" className="primary-btn" style={{ marginTop: '1rem' }}>
          Criar Despesa
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default CriarDespesaForm;
