import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedAdminComp = ({ houseId }) => {
  const [house, setHouse] = useState(null);
  const [members, setMembers] = useState([]);
  const [newInviteCode, setNewInviteCode] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [houseName, setHouseName] = useState('');
  const [houseAddress, setHouseAddress] = useState('');
  const [houseDescription, setHouseDescription] = useState('');
  const [houseRules, setHouseRules] = useState('');
  const [message, setMessage] = useState('');

  const BASE_URL = 'http://localhost:8000/backend';

  const getCSRFToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
  };

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/`, { withCredentials: true });
        setHouse(res.data);
        setHouseName(res.data.name);
        setHouseAddress(res.data.address);
        setHouseDescription(res.data.description || '');
        setHouseRules(res.data.rules || '');
      } catch {
        setMessage('Erro ao carregar a casa.');
      }
    };

    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/members/`, { withCredentials: true });
        setMembers(res.data);
      } catch {
        setMessage('Erro ao carregar os membros.');
      }
    };

    fetchHouse();
    fetchMembers();
  }, [houseId]);

  const generateInvite = async () => {
    setMessage('');
    try {
      const res = await axios.post(
        `${BASE_URL}/houses/${houseId}/generate_invite/`,
        {},
        {
          withCredentials: true,
          headers: { 'X-CSRFToken': getCSRFToken() },
        }
      );
      setNewInviteCode(res.data.code);
      setMessage('Convite gerado com sucesso.');
    } catch {
      setMessage('Erro ao gerar convite.');
    }
  };

  const removeMember = async (userId) => {
    setMessage('');
    try {
      await axios.delete(`${BASE_URL}/houses/${houseId}/members/${userId}/remove_member/`, {
        withCredentials: true,
        headers: { 'X-CSRFToken': getCSRFToken() },
      });
      setMembers(members.filter(m => m.id !== userId));
      setMessage('Membro removido com sucesso.');
    } catch {
      setMessage('Erro ao remover membro.');
    }
  };

  const saveHouseEdit = async () => {
    setMessage('');
    try {
      const res = await axios.put(
        `${BASE_URL}/houses/${houseId}/`,
        {
          name: houseName,
          address: houseAddress,
          description: houseDescription,
          rules: houseRules
        },
        {
          withCredentials: true,
          headers: { 'X-CSRFToken': getCSRFToken() },
        }
      );
      setHouse(res.data);
      setEditMode(false);
      setMessage('Casa atualizada com sucesso.');
    } catch (err) {
      if (err.response?.data?.detail) {
        setMessage(err.response.data.detail);
      } else if (err.response?.data) {
        setMessage(JSON.stringify(err.response.data));
      } else {
        setMessage('Erro ao atualizar a casa.');
      }
    }
  };

  if (!house) return <div>A carregar...</div>;

  return (
    <div>
      <h1>Feed da Casa</h1>

      {editMode ? (
        <div>
          <div>
            <label>Nome:</label>
            <input type="text" value={houseName} onChange={e => setHouseName(e.target.value)} />
          </div>
          <div>
            <label>Endereço:</label>
            <textarea value={houseAddress} onChange={e => setHouseAddress(e.target.value)} />
          </div>
          <div>
            <label>Descrição:</label>
            <textarea value={houseDescription} onChange={e => setHouseDescription(e.target.value)} />
          </div>
          <div>
            <label>Regras:</label>
            <textarea value={houseRules} onChange={e => setHouseRules(e.target.value)} />
          </div>
          <button onClick={saveHouseEdit}>Guardar</button>
          <button onClick={() => setEditMode(false)}>Cancelar</button>
        </div>
      ) : (
        <div>
          <h2>{house.name}</h2>
          <p><strong>Endereço:</strong> {house.address}</p>
          <p><strong>Descrição:</strong> {house.description}</p>
          <p><strong>Regras:</strong> {house.rules}</p>
          <p><strong>Criada a:</strong> {new Date(house.created_at).toLocaleString()}</p>
          <p><strong>Última atualização:</strong> {new Date(house.updated_at).toLocaleString()}</p>
          <button onClick={() => setEditMode(true)}>Editar Casa</button>
        </div>
      )}

      <hr />

      <div>
        <h3>Membros</h3>
        <ul>
          {members.map(member => (
            <li key={member.id}>
              {member.username} ({member.email})
              <button onClick={() => removeMember(member.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>

      <hr />

      <div>
        <h3>Gerar Convite</h3>
        <button onClick={generateInvite}>Gerar Código</button>
        {newInviteCode && (
          <p>Código do convite: <strong>{newInviteCode}</strong></p>
        )}
      </div>

      {message && <p style={{ color: 'darkred' }}>{message}</p>}
    </div>
  );
};

export default FeedAdminComp;
