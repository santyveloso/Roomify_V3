
import React from 'react';

const Task = ({ task }) => {
    const { title, description, assigned_to, due_date, created_at, status, category } = task;

    const formatDate = (iso) => {
        if (!iso) return 'Sem data';
        const date = new Date(iso);
        return date.toLocaleString();
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
            <p><strong>Estado:</strong> <span className="post-aviso">{status}</span></p>
            <p><strong>Data Limite:</strong> {formatDate(due_date)}</p>
        </div>
    );
};

export default Task;
