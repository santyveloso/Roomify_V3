import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CriarCasaForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    rules: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/backend/houses/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Casa criada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setMessage('Erro ao criar a casa.');
    }
  };

  return (
    <div className="task-form-wrapper">
      <h2 className="create-or-join-title">Criar Nova Casa</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome da Casa</label>
          <input
            type="text"
            name="name"
            placeholder="Ex: Casa da Rua Verde"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Endereço</label>
          <input
            type="text"
            name="address"
            placeholder="Ex: Rua das Oliveiras 123"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Descrição</label>
          <textarea
            name="description"
            placeholder="Ex: Apartamento com 3 quartos, 2 wc..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Regras</label>
          <textarea
            name="rules"
            placeholder="Ex: Limpar cozinha à sexta, dividir contas..."
            value={formData.rules}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="primary-btn">
          Criar Casa
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default CriarCasaForm;
