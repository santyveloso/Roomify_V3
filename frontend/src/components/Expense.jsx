import React from 'react';

const Expense = ({ expense, onDelete, isAdmin }) => {
  const { id, title, amount, date, category, description, assigned_roomies } = expense;

  const formatDate = (iso) => {
    const dateObj = new Date(iso);
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
  };

  const handleDelete = async () => {
    if (window.confirm("Tens a certeza que queres apagar esta despesa?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/backend/expenses/${id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 204) {
          onDelete(id);
        } else {
          alert("Erro ao apagar a despesa.");
        }
      } catch (error) {
        console.error("Erro ao apagar despesa:", error);
        alert("Erro ao apagar a despesa.");
      }
    }
  };

  return (
    <div className="post-wrapper">
      <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>{title || 'Sem título'}</h3>
        <span>{formatDate(date)}</span>
      </div>

      <p><strong>Categoria:</strong> {category || 'Sem categoria'}</p>
      <p><strong>Valor:</strong> € {Number(amount).toFixed(2)}</p>
      {description && <p><strong>Descrição:</strong> {description}</p>}

      {assigned_roomies && assigned_roomies.length > 0 && (
        <div>
          <p><strong>Divisão entre roomies:</strong></p>
          <ul>
            {assigned_roomies.map(({ user, amount_due }) => (
              <li key={user?.id || user}>
                {user?.username || `Usuário ${user}`} — € {parseFloat(amount_due).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
          )}

          {isAdmin && (
              <button
                  onClick={handleDelete}
                  style={{
                      marginTop: '10px',
                      backgroundColor: '#fcebea',
                      color: '#c0392b',
                      border: '1px solid #c0392b',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8d7da';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#fcebea';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                  }}
              >
                  Apagar Despesa
              </button>
          )}


      </div>
  );
};

export default Expense;
