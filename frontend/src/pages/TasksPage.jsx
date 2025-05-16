import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
    });
    const [message, setMessage] = useState('');
    const BASE_URL = 'http://localhost:8000/backend/tasks';

    // Buscar lista de tarefas
    useEffect(() => {
        axios.get(BASE_URL, { withCredentials: true })
            .then(res => setTasks(res.data))
            .catch(() => setMessage('Erro ao carregar tarefas.'));
    }, []);

    // Quando seleciona tarefa para editar, preencher formData
    const selectTask = (task) => {
        setSelectedTask(task);
        setFormData({
            title: task.title || '',
            description: task.description || '',
            assigned_to: task.assigned_to || '',
            due_date: task.due_date ? task.due_date.slice(0, 16) : '',
        });
        setMessage('');
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getCSRFToken = () => {
        return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    };

    // Guardar edição
    const saveTask = async () => {
        if (!selectedTask) return;
        setMessage('');
        try {
            const res = await axios.put(`${BASE_URL}${selectedTask.id}/`, formData, {
                headers: { 'X-CSRFToken': getCSRFToken() },
                withCredentials: true,
            });
            // Atualizar a tarefa na lista
            setTasks(tasks.map(t => t.id === res.data.id ? res.data : t));
            setSelectedTask(res.data);
            setMessage('Tarefa atualizada com sucesso.');
        } catch {
            setMessage('Erro ao atualizar tarefa.');
        }
    };

    return (
        <div>
            <h1>Lista de Tarefas</h1>

            {message && <p>{message}</p>}

            <ul>
                {tasks.map(task => (
                    <li key={task.id} style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                        <strong onClick={() => selectTask(task)}>{task.title}</strong> - Status: {task.status}
                    </li>
                ))}
            </ul>

            {selectedTask && (
                <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                    <h2>Editar Tarefa: {selectedTask.title}</h2>
                    <label>Título</label><br />
                    <input name="title" value={formData.title} onChange={handleChange} /><br />

                    <label>Descrição</label><br />
                    <textarea name="description" value={formData.description} onChange={handleChange} /><br />

                    <label>Data Limite</label><br />
                    <input type="datetime-local" name="due_date" value={formData.due_date} onChange={handleChange} /><br /><br />

                    <button onClick={saveTask}>Guardar</button>
                    <button onClick={() => setSelectedTask(null)} style={{ marginLeft: '1rem' }}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default TasksPage;