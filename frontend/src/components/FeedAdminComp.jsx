import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './FeedAdminComp.module.css';
import { useNavigate } from 'react-router-dom';
import Post from './Post';
import Task from './Task';
import Expense from './Expense';


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
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [timeOfDayGreeting, setTimeOfDayGreeting] = useState('');

  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:8000/backend';

  const getCSRFToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
  };

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/`, { withCredentials: true });
        setHouse(res.data);
        setHouseName(res.data.name);
        setHouseAddress(res.data.address);
        setHouseDescription(res.data.description || '');
        setHouseRules(res.data.rules || '');
      } catch {
        setMessage('Erro ao carregar os dados da casa.');
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

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/profile/`, { withCredentials: true });
        setUserName(res.data.username || 'Utilizador');
        setUserId(res.data.id);
      } catch {
        setUserName('Utilizador');
        console.error('Erro ao carregar o perfil do utilizador.');
      }
    };

    const getCurrentTimeOfDayGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 6 && currentHour < 12) {
        return 'Bom dia';
      } else if (currentHour >= 12 && currentHour < 20) {
        return 'Boa tarde';
      } else {
        return 'Boa noite';
      }
    };

    fetchHouseData();
    fetchMembers();
    fetchUserProfile();
    //setTimeOfDayGreeting(getCurrentTimeOfDayGreeting());

  }, [houseId]);

  useEffect(() => {
  const getCurrentTimeOfDayGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) return 'Bom dia';
    else if (currentHour >= 12 && currentHour < 20) return 'Boa tarde';
    else return 'Boa noite';
  };

  if (userName) {
    setTimeOfDayGreeting(getCurrentTimeOfDayGreeting());
  }
}, [userName]);


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

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/posts/`, { withCredentials: true });
        setPosts(res.data);
      } catch {
        console.error('Erro ao carregar os posts.');
      }
    };
    fetchPosts();
  }, [houseId]);

  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/tasks/`, { withCredentials: true });
        setTasks(res.data);
      } catch {
        console.error('Erro ao carregar as tarefas.');
      }
    };
    fetchTasks();
  }, [houseId]);

  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/expenses/`, { withCredentials: true });
        setExpenses(res.data);
      } catch {
        console.error('Erro ao carregar as despesas.');
      }
    };
    fetchExpenses();
  }, [houseId]);

  const [saldo, setSaldo] = useState([]);
  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/balance/`, { withCredentials: true });
        setSaldo(res.data);
      } catch {
        console.error('Erro ao carregar o saldo.');
      }
    };
    fetchSaldo();
  }, []);

  if (!house) return <div>A carregar...</div>;

  return (
    <div className={styles.feedContainer}>
      <h1 className={styles.dynamicGreeting}>
        {timeOfDayGreeting}, <span className={styles.italicUsername}>{userName}</span>!
      </h1>

      <h2>Feed da Casa</h2>

      <div className={styles.columnsWrapper}>
        <div className={styles.detailsColumn}>
          {editMode ? (
            <div>
              <h3>Editar Casa</h3>
              <div>
                <label htmlFor={`houseName-${houseId}`} className={styles.formLabel}>Nome:</label>
                <input id={`houseName-${houseId}`} className={styles.formInput} type="text" value={houseName} onChange={e => setHouseName(e.target.value)} />
              </div>
              <div>
                <label htmlFor={`houseAddress-${houseId}`} className={styles.formLabel}>Endereço:</label>
                <textarea id={`houseAddress-${houseId}`} className={styles.formTextarea} value={houseAddress} onChange={e => setHouseAddress(e.target.value)} />
              </div>
              <div>
                <label htmlFor={`houseDescription-${houseId}`} className={styles.formLabel}>Descrição:</label>
                <textarea id={`houseDescription-${houseId}`} className={styles.formTextarea} value={houseDescription} onChange={e => setHouseDescription(e.target.value)} />
              </div>
              <div>
                <label htmlFor={`houseRules-${houseId}`} className={styles.formLabel}>Regras:</label>
                <textarea id={`houseRules-${houseId}`} className={styles.formTextarea} value={houseRules} onChange={e => setHouseRules(e.target.value)} />
              </div>
              <div className={styles.buttonGroup}>
                <button onClick={() => setEditMode(false)} className={styles.secondaryButton}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              <h2>{house.name}</h2>
              <p><strong>Endereço:</strong> {house.address}</p>
              <p><strong>Descrição:</strong> {house.description}</p>
              <p><strong>Regras:</strong> {house.rules}</p>
              <p><strong>Criada a:</strong> {new Date(house.created_at).toLocaleString()}</p>
              <p><strong>Última atualização:</strong> {new Date(house.updated_at).toLocaleString()}</p>
              <button onClick={() => setEditMode(true)} className={styles.primaryButton}>Editar Casa</button>
            </div>
          )}
        </div>

        <div className={styles.membersColumn}>
          <h3>Membros</h3>
          <ul className={styles.membersList}>
            {members.map(member => (
              <li key={member.id} className={styles.memberItem}>
                <span>
                  {member.username} ({member.email})
                  {member.id === house.admin ? ' [admin]' : ' [roomie]'}
                  {member.id === userId ? ' (You)' : ''}
                </span>
                <button onClick={() => removeMember(member.id)} className={styles.removeButton}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.postsColumn}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Posts da Casa</h3>
          <button className="primary-btn" onClick={() => navigate('/criarpost', { state: { houseId } })}>
            Criar Post
          </button>
        </div>
        {posts.length === 0 ? (
          <p>Sem posts ainda.</p>
        ) : (
          posts.map((p) => <Post key={p.id} post={p} />)
        )}
      </div>

      <div className={styles.postsColumn}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Tarefas da Casa</h3>
          <button className="primary-btn" onClick={() => navigate('/criartarefa', { state: { houseId } })}>
            Criar Tarefa
          </button>
        </div>
        {tasks.length === 0 ? (
          <p>Sem tarefas ainda.</p>
        ) : (
          tasks.map((t) => <Task key={t.id} task={t} />)
        )}
      </div>

      <div className={styles.postsColumn}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Despesas da Casa</h3>
          <button className="primary-btn" onClick={() => navigate('/criardespesa', { state: { houseId } })}>
            Criar Despesa
          </button>
        </div>
        {expenses.length === 0 ? (
          <p>Sem despesas ainda.</p>
        ) : (
          expenses.map((expense) => <Task key={expense.id} task={expense} />)
        )}
      </div>

      <div>
        <h3>Saldo do Utilizador</h3>
        <p>Saldo em dívida: € {saldo.total_due !== undefined ? Number(saldo.total_due).toFixed(2) : '0.00'}</p>
      </div>
    </div>
  );
};

export default FeedAdminComp;
