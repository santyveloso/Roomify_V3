import styles from './FeedAdminComp.module.css';

import React from 'react';
import axios from 'axios';

const Expense = ({ expense, currentUserId, onDelete, isAdmin, onRefresh }) => {
    const { id, title, amount, date, category, description, shares, created_at, } = expense;

    console.log("CurrentUserId:", currentUserId);
    console.log("Shares:", shares);

    const formatDate = (iso) => {
        const dateObj = new Date(iso);
        return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
    };

    function getCSRFToken() {
        return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    }

    const handleDelete = async () => {
        if (window.confirm("Tens a certeza que queres apagar esta despesa?")) {
            try {
                const response = await axios.delete(`http://localhost:8000/backend/expenses/${id}/`, {
                    headers: { 'X-CSRFToken': getCSRFToken() },
                    withCredentials: true
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

    const handlePayShare = async (shareId) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/backend/expenses/${shareId}/pay/`,
                {},
                {
                    headers: { 'X-CSRFToken': getCSRFToken() },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                // Chamar onRefresh para atualizar a lista após pagamento
                if (onRefresh) onRefresh();
            } else {
                alert("Erro ao marcar como pago.");
            }
        } catch (error) {
            console.error("Erro ao marcar como pago:", error);
            alert("Erro ao comunicar com o servidor.");
        }
    };

    return (
        <div className="post-wrapper">
            <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{title || 'Sem título'}</h3>


                <span>{formatDate(created_at)}</span>
            </div>

            <p><strong>Categoria:</strong> {category || 'Sem categoria'}</p>
            <p><strong>Valor:</strong> € {Number(amount).toFixed(2)}</p>
            <p><strong>Estado:</strong> {expense.all_paid ? 'Paga' : 'Por pagar'}</p>
            <p><strong>Data limite:</strong> {date}</p>


            {description && <p><strong>Descrição:</strong> {description}</p>}

            {shares && shares.length > 0 && (
                <div>
                    <p><strong>Divisão entre roomies:</strong></p>
                    <ul>
                        {shares.map((share) => (
                            <li key={share.id}>
                                {share.user_name} — € {parseFloat(share.amount_due).toFixed(2)} — {share.paid ? "✅ Pago" : "❌ Por pagar"}

                                {/*                                
                                <div style={{ fontSize: "0.8em", color: "gray" }}>
                                    <div>Share ID: {share.id}</div>
                                    <div>Utilizador da share: {share.user_id}</div>
                                    <div>User atual: {currentUserId}</div>
                                </div> */}

                                {/* Mostrar botão só para shares do user atual e que ainda não foram pagas */}
                                {!share.paid && share.user_id === currentUserId && (

                                    // <button
                                    //     onClick={() => handlePayShare(share.id)}
                                    //     style={{
                                    //         backgroundColor: '#1e8449',
                                    //         color: 'white',
                                    //         border: 'none',
                                    //         borderRadius: '4px',
                                    //         padding: '6px 12px',
                                    //         cursor: 'pointer',
                                    //         fontWeight: '600',
                                    //         boxShadow: '0 2px 5px rgba(30, 132, 73, 0.4)',
                                    //         transition: 'background-color 0.3s ease'
                                    //     }}
                                    //     onMouseEnter={e => e.currentTarget.style.backgroundColor = '#166933'}
                                    //     onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1e8449'}
                                    // >
                                    //     Marcar como pago
                                    // </button>

                                    <button className={styles.primaryButton}
                                        style={{ marginLeft: '10px' }}
                                        onClick={() => {
                                            //setDebugMessage(`Pagando share ${share.id}...`);
                                            handlePayShare(share.id);
                                            <div>User atual: {currentUserId}</div>
                                        }}
                                    >
                                        Pagar
                                    </button>
                                )}
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
