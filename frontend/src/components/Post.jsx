import React from 'react';
import CommentSection from './CommentSection';

const Post = ({ post, isAdmin, onDelete }) => {
  const { id, author, content, is_aviso, created_at } = post;

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  const handleDelete = async () => {
    if (window.confirm("Tens a certeza que queres apagar este post?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/backend/posts/${id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 204) {
          onDelete(id);
        } else {
          alert("Erro ao apagar o post.");
        }
      } catch (error) {
        console.error("Erro ao apagar post:", error);
        alert("Erro ao apagar o post.");
      }
    }
  };

  return (
    <div className="post-wrapper">
      <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="post-author">{author?.username || 'Desconhecido'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.9rem', color: '#555' }}>{formatDate(created_at)}</span>
          {isAdmin && (
            <button
              onClick={handleDelete}
              style={{
                backgroundColor: '#fcebea',
                color: '#c0392b',
                border: '1px solid #c0392b',
                padding: '6px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s ease-in-out'
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
              Apagar Post
            </button>
          )}
        </div>
      </div>

      <p className="post-content">{content}</p>
      {is_aviso && <span className="post-aviso">AVISO</span>}

      <CommentSection postId={id} commentBoxClass="bg-gray-100 rounded-lg p-3 my-2" />
    </div>
  );
};

export default Post;
