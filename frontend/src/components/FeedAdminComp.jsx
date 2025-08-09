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
        console.log('ADMIN DA CASA:', res.data.admin);

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

    fetchUserProfile();
    fetchHouseData();
    fetchMembers();


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

  const handleDeletePost = (id) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

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


  const handleDeleteTask = (deletedId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== deletedId));
  };



  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/houses/${houseId}/expenses/`, { withCredentials: true });
      setExpenses(res.data);
    } catch {
      console.error('Erro ao carregar as despesas.');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [houseId]);

  const [saldo, setSaldo] = useState([]);
  const fetchSaldo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/balance/`, { withCredentials: true });
      setSaldo(res.data);
    } catch {
      console.error('Erro ao carregar o saldo.');
    }
  };

  useEffect(() => {

    fetchSaldo();
  }, []);

  if (!house) return <div>A carregar...</div>;


  const handleGenerateInvite = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/houses/${houseId}/generate_invite/`, {}, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': getCSRFToken()
        }
      });

      const novoCodigo = res.data.code;
      setHouse(prev => ({ ...prev, invite_code: novoCodigo }));
      setMessage('Novo código de convite gerado!');
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      setMessage('Erro ao gerar código de convite.');
    }

  };

  // if (userId === null) {
  //   return <div>A carregar perfil do utilizador...</div>;
  // } else {
  //   return <div>ID do utilizador inválido: {String(userId)}</div>;
  //   console.log('userId:', userId, 'typeof:', typeof userId, 'JSON.stringify:', JSON.stringify(userId));
  // }


  console.log("userId:", userId);
  console.log("house.admin:", house?.admin?.id);
  return (
    <div className={styles.feedContainer}>
      <h1 className={styles.dynamicGreeting}>
        {timeOfDayGreeting}, <span className={styles.italicUsername}>{userName} </span>!
      </h1>



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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p><strong>Código de Convite:</strong> {house.invite_code || 'Nenhum'}</p>
            <button
              className="primary-btn"
              style={{ padding: '6px 12px', fontSize: '0.9rem' }}
              onClick={handleGenerateInvite}
            >
              Gerar Código
            </button>
          </div>

          <ul className={styles.membersList}>

            {members.map(member => (
              <li key={member.id} className={styles.memberItem}>
                <span>
                  {member.username} ({member.email})
                  {member.username === house.admin ? ' [admin]' : ' [roomie]'}

                  {Number(member.id) === Number(userId) && ' [you]'}
                </span>




                <button
                  onClick={() => removeMember(member.id)}
                  style={{
                    backgroundColor: 'var(--light-background)',
                    color: 'var(--error-color)',
                    border: '1px solid var(--error-color)',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease-in-out',
                    marginLeft: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--background-color)';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--light-background)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>



      <div className={styles.columnsWrapper}>

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
            tasks.map((t) => (
              <Task
                key={t.id}
                task={t}
                onDelete={handleDeleteTask}
                userId={userId} //ve o user type
                isAdmin={userId === house.admin}
              />
            ))
          )}

        </div>

        <div className={styles.postsColumn}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Despesas da Casa</h3>

            <button className="primary-btn" onClick={() => navigate('/criardespesa', { state: { houseId } })}>
              Criar Despesa
            </button>



          </div>
          <h2>SALDO EM DÍVIDA: {saldo.balance !== undefined ? Number(saldo.balance).toFixed(2) : '0.00'} €</h2>

          {expenses.length === 0 ? (
            <p>Sem despesas ainda.</p>
          ) : (
            expenses.map((expense) => (
              <Expense

                key={expense.id}

                expense={expense}
                currentUserId={userId}
                onDelete={(id) => setExpenses(prev => prev.filter(e => e.id !== id))}
                isAdmin={userId === house.admin.id}
                onRefresh={() => {
                  fetchSaldo();
                  fetchExpenses();
                }}

              />

            )))}

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
          posts.map((p) => (
            <Post
              key={p.id}
              post={p}
              isAdmin={userId === house.admin.id}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>


    </div>
  );
};

export default FeedAdminComp;
