    import React, { useState } from 'react';

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

    const handleDelete = async () => {
        if (window.confirm("Tens a certeza que queres apagar esta tarefa?")) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/backend/tasks/${id}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
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
        const token = localStorage.getItem('token');
        console.log("Token:", token); // DEBUG
        const response = await fetch(`http://localhost:8000/backend/tasks/${id}/complete/`, {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${token}`

            }
        });

        if (response.ok) {
            setTaskStatus('completed');
        } else {
            const data = await response.json();
            alert(data.detail || "Erro ao concluir a tarefa.");
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

        {/* Botão Concluir – visível a todos se ainda não estiver concluída */}
        {taskStatus !== 'completed' && (
            <button
            onClick={handleComplete}
            style={{
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '8px',
                marginRight: '10px'
            }}
            >
            Concluir Tarefa
            </button>
        )}

        {/* Botão Apagar – visível apenas se for admin */}
        {isAdmin && (
            <button
            onClick={handleDelete}
            style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '8px'
            }}
            >
            Apagar Tarefa
            </button>
        )}
        </div>
    );
    };

    export default Task;
