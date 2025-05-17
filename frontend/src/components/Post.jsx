import React from 'react';
import CommentSection from './CommentSection';

const Post = ({ post }) => {
  console.log('AAAAAAAAAAAAAAAAAAAAPost ID:', post.id);
  const { author, content, is_aviso, created_at } = post;

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  return (
    <div className="post-wrapper">
      <div className="post-header">
        <span className="post-author">{author?.username || 'Desconhecido'}</span>
        <span>{formatDate(created_at)}</span>

      </div>
      <p className="post-content">{content}</p>
      {is_aviso && <span className="post-aviso">AVISO</span>}

      {/* Comentários do post */}
      <CommentSection postId={post.id} commentBoxClass="bg-gray-100 rounded-lg p-3 my-2" />
    </div>
  );
};

export default Post;
