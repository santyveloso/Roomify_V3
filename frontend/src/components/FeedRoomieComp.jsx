import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedRoomieComp = ({ houseId }) => {
  const [house, setHouse] = useState(null);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState('');
  const [saldo, setSaldo] = useState([]);


  const BASE_URL = 'http://localhost:8000/backend';

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/`, { withCredentials: true });
        setHouse(res.data);
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


    const fetchSaldo = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/balance/`, { withCredentials: true });
        setSaldo(res.data);
      } catch {
        console.error('Erro ao carregar o saldo.');
      }
    };

    fetchSaldo();

    fetchHouse();
    fetchMembers();
  }, [houseId]);

  if (!house) return <div>A carregar...</div>;

  return (
    <div>
      <h1>Feed da Casa</h1>

      <div>
        <h2>{house.name}</h2>
        <p><strong>Endereço:</strong> {house.address}</p>
        <p><strong>Descrição:</strong> {house.description}</p>
        <p><strong>Regras:</strong> {house.rules}</p>
        <p><strong>Criada a:</strong> {new Date(house.created_at).toLocaleString()}</p>
        <p><strong>Última atualização:</strong> {new Date(house.updated_at).toLocaleString()}</p>
      </div>

      <hr />

      <div>
        <h3>Membros</h3>
        <ul>
          {members.map(member => (
            <li key={member.id}>
              {member.username} ({member.email})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Saldo do Utilizador</h3>
        {/* <p>Total devido: € {saldo.total_due !== undefined ? Number(saldo.total_due).toFixed(2) : '0.00'}</p> */}
        <p>Saldo em dívida: € {saldo.total_due.toFixed(2)}</p>
        {/* <p>Total pago: € {saldo.total_paid.toFixed(2)}</p>
        <p>Saldo atual: € {saldo.balance.toFixed(2)}</p> */}
      </div>

      {message && <p style={{ color: 'darkred' }}>{message}</p>}
    </div>


  );
};

export default FeedRoomieComp;
