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
  const [timeOfDayGreeting, setTimeOfDayGreeting] = useState('');


  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:8000/backend';

  const getCSRFToken = () => {
    return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
  };



  useEffect(() => {

    // CASA
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

    // MEMBROS DA CASA
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/members/`, { withCredentials: true });
        setMembers(res.data);
      } catch {
        setMessage('Erro ao carregar os membros.');
      }
    };

    // PERFIL
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/profile/`, { withCredentials: true });
        setUserName(res.data.username || 'Utilizador');
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
    setTimeOfDayGreeting(getCurrentTimeOfDayGreeting());

  }, [houseId]);


  // CONVITES
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

  // REMOVER MEMBROS
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

  //POSTS
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


  //TASKS
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/tasks/`, { withCredentials: true });
        setTasks(res.data);
      } catch {
        console.error('Erro ao carregar os posts.');
      }
    };

    fetchTasks();
  }, [houseId]);


  //DESPESAS

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/houses/${houseId}/expenses/`, { withCredentials: true });
        setExpenses(res.data);
      } catch {
        console.error('Erro ao carregar os posts.');
      }
    };

    fetchExpenses();
  }, [houseId]);

  //SALDO

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
    <div className={styles.feedContainer}>
      <h1 className={styles.dynamicGreeting}>
        {timeOfDayGreeting}, <span className={styles.italicUsername}>{userName}</span>!
      </h1>

      <h2>Feed da Casa</h2>

      <div className={styles.columnsWrapper}>
        {/* Coluna 1: Detalhes da Casa */}
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
                <button onClick={saveHouseEdit} className={styles.primaryButton}>Guardar</button>
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

        {/* Coluna 2: Membros */}
        <div className={styles.membersColumn}>
          <h3>Membros</h3>
          <ul className={styles.membersList}>
            {members.map(member => (
              <li key={member.id} className={styles.memberItem}>
                <span>{member.username} ({member.email})</span>
                <button onClick={() => removeMember(member.id)} className={styles.removeButton}>Remover</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 3: Gerar Convite & Mensagens */}
        <div className={styles.inviteColumn}>
          <div>
            <h3>Gerar Convite</h3>
            <button onClick={generateInvite} className={styles.primaryButton}>Gerar Código</button>
            {newInviteCode && (
              <p>Código do convite: <strong>{newInviteCode}</strong></p>
            )}
          </div>
          {message && <p className={styles.messageText}>{message}</p>}
        </div>
        <button onClick={() => navigate('/criarpost', { state: { houseId } })}>
          Criar Post
        </button>
        <button onClick={() => navigate('/criardespesa', { state: { houseId } })}>
          Criar Despesa
        </button>


      </div>


      <div className={styles.postsColumn}>
        <h3>Posts da Casa</h3>
        {posts.length === 0 ? (
          <p>Sem posts ainda.</p>
        ) : (
          posts.map((p) => <Post key={p.id} post={p} />)
        )}
      </div>



      <div className={styles.postsColumn}>
        <h3>Tarefas da Casa</h3>
        {tasks.length === 0 ? (
          <p>Sem tarefas ainda.</p>
        ) : (
          tasks.map((t) => <Task key={t.id} task={t} />)
        )}
      </div>


      <div className={styles.postsColumn}>
        <h3>Despesas da Casa</h3>
        {expenses.length === 0 ? (
          <p>Sem despesas ainda.</p>
        ) : (
          expenses.map((expense) => <Task key={expense.id} task={expense} />)
        )}
      </div>

      <div>
        <h3>Saldo do Utilizador</h3>
        <p>Saldo em dívida: € {saldo.total_due !== undefined ? Number(saldo.total_due).toFixed(2) : '0.00'}</p>
        {/* <p>Saldo em dívida: € {saldo.total_due.toFixed(2)}</p> */}
        {/* <p>Total pago: € {saldo.total_paid.toFixed(2)}</p>
        <p>Saldo atual: € {saldo.balance.toFixed(2)}</p> */}
      </div>



    </div>
  );
};

export default FeedAdminComp;
