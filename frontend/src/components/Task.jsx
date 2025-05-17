import React from 'react';

const Task = ({ task }) => {
    const { title, description, assigned_to, due_date, created_at } = task;

    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleString();
    };

    return (
        <div className="post-wrapper">
            <div className="post-header">
                <span className="post-author">{assigned_to.username}</span>
                <span>{formatDate(created_at)}</span>
            </div>
            <p className="post-content">{description}</p>
            {/* {is_aviso && <span className="post-aviso">AVISO</span>} */}
        </div>
    );
};

export default Task;

