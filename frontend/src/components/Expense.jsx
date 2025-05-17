import React from 'react';

const Expense = ({ expense }) => {
    const { title, amount, date, category, description, assigned_roomies } = expense;

    const formatDate = (iso) => {
        const dateObj = new Date(iso);
        return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
    };

    return (
        <div>
            <div>
                <h3>{title || 'Sem título'}</h3>
                <span>{formatDate(date)}</span>
            </div>

            <p>{category || 'Sem categoria'}</p>

            <p>€ {amount?.toFixed(2)}</p>

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



        </div>


    );
};

export default Expense;