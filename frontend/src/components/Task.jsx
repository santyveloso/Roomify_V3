import React, { useState } from 'react';
import axios from 'axios';

const Task = ({ task, onDelete, userId, isAdmin }) => {


    const {
        id,
        title,
        description,
        assigned_to,
        due_date,
        created_at,
        status,
        category
    } = task;

    const [taskStatus, setTaskStatus] = useState(status);

    const formatDate = (iso) => {
        if (!iso) return 'Sem data';
        const date = new Date(iso);
        return date.toLocaleString();
    };

    function getCSRFToken() {
        return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    }

    const handleDelete = async () => {
        if (window.confirm("Tens a certeza que queres apagar esta tarefa?")) {
            try {
                const response = await axios.delete(`http://localhost:8000/backend/tasks/${id}/`, {
                    headers: {
                        'X-CSRFToken': getCSRFToken()
                    },
                    withCredentials: true
                });

                if (response.status === 204) {
                    onDelete(id);
                } else {
                    alert("Erro ao apagar a tarefa.");
                }
            } catch (error) {
                console.error("Erro ao apagar:", error);
                alert("Erro ao apagar a tarefa.");
            }
        }
    };





    const handleComplete = async () => {
        if (taskStatus === 'completed') {
            alert("Esta tarefa já foi concluída.");
            return;
        }
        try {
            const response = await axios.post(
                `http://localhost:8000/backend/tasks/${id}/complete/`,
                {}, // corpo vazio
                {
                    headers: {
                        'X-CSRFToken': getCSRFToken()
                    },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                setTaskStatus('completed');
            } else {
                alert("Erro ao concluir a tarefa.");
            }
        } catch (error) {
            console.error("Erro ao concluir:", error);
            alert("Erro ao comunicar com o servidor.");
        }
    };

    return (
        <div className="post-wrapper">
            <div className="post-header">
                <span className="post-author">{assigned_to || 'Sem responsável'}</span>
                <span>{formatDate(created_at)}</span>
            </div>
            <h3>{title}</h3>
            <p className="post-content">{description}</p>
            <p><strong>Categoria:</strong> <span className="post-aviso">{category?.name || category}</span></p>
            <p><strong>Estado:</strong> <span className="post-aviso">{taskStatus === 'completed' ? 'Concluída' : 'Por fazer'}</span></p>
            <p><strong>Data Limite:</strong> {formatDate(due_date)}</p>

            {/* Botão Concluir */}
            {taskStatus !== 'completed' && (
                <button
                    onClick={handleComplete}
                    style={{
                        marginTop: '10px',
                        backgroundColor: 'var(--light-background)',
                        color: '#1e8449',
                        border: '1px solid #1e8449',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease-in-out'
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
                    Concluir Tarefa
                </button>
            )}

            {/* Botão Apagar */}
            {isAdmin && (
                <button
                    onClick={handleDelete}
                    style={{
                        marginTop: '10px',
                        marginLeft: '10px',
                        backgroundColor: 'var(--light-background)',
                        color: '#c0392b',
                        border: '1px solid #c0392b',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease-in-out'
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
                    Apagar Tarefa
                </button>
            )}
        </div>
    );
};

export default Task;
