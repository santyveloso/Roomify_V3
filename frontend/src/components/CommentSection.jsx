
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './FeedAdminComp.module.css';


export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [message, setMessage] = useState('');

    const BASE_URL = `http://localhost:8000/backend/posts/${postId}/comments/`;

    function getCSRFToken() {
        return document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    }

    useEffect(() => {
        axios.get(BASE_URL, { withCredentials: true })
            .then(res => setComments(res.data))
            .catch(() => setMessage('Erro ao carregar comentários.'));
    }, [postId]);




    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit chamado');
        if (!newComment.trim()) return;

        const payload = { content: newComment };

        try {
            const response = await axios.post(BASE_URL, payload, {
                headers: { 'X-CSRFToken': getCSRFToken() },
                withCredentials: true,
            });

            const createdComment = response.data;
            // Adiciona o novo comentário à lista existente
            setComments(prev => [...prev, createdComment]);
            setNewComment('');
            setMessage('Comentario criada com sucesso!');

            //navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setMessage('Erro ao criar comentario.');
        }


    }
    return (
        <div className="mt-4 border-t pt-2">
            <h4 className="font-semibold mb-2">Comentários</h4>


            {comments.map(comment => (
                <div
                    key={comment.id}
                    style={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        marginBottom: '10px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <p style={{ fontWeight: '600', margin: 0 }}>
                            {comment.author?.username || 'Utilizador'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>
                            {new Date(comment.created_at).toLocaleString()}
                        </p>
                    </div>
                    <p style={{ margin: 0 }}>{comment.content}</p>
                </div>
            ))}




            <form onSubmit={handleSubmit} className="mt-3">
                <textarea className="w-full p-2 border rounded"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreve um comentário..."
                    rows={2}
                    style={{
                        width: '95%',
                        padding: '12px 14px',
                        border: '1.5px solid #ccc',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                        marginTop: '50px',
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#ccc'}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="submit" className={styles.primaryButton} >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
}