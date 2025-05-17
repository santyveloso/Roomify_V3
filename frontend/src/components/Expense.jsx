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
    <div>
      <div>
        <h3>{title || 'Sem título'}</h3>
        <span>{formatDate(date)}</span>
      </div>

      <p>{category || 'Sem categoria'}</p>
      <p>€ {Number(amount).toFixed(2)}</p>
      {description && <p>{description}</p>}

      {assigned_roomies && assigned_roomies.length > 0 && (
        <div>
          <p>Divisão entre roomies:</p>
          <ul>
            {assigned_roomies.map(({ user, amount_due }) => (
              <li key={user?.id || user}>
                {user?.username || `Usuário ${user}`} — € {parseFloat(amount_due).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Só mostra o botão se for admin */}
      {isAdmin && (
        <button onClick={handleDelete} style={{ marginTop: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          Apagar Despesa
        </button>
      )}
    </div>
  );
};

export default Expense;
