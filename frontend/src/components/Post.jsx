import React from 'react';

const Post = ({ post }) => {
  const { author, content, is_aviso, created_at } = post;

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  return (
    <div className="post-wrapper">
      <div className="post-header">
        <span className="post-author">{author.username}</span>
        <span>{formatDate(created_at)}</span>
      </div>
      <p className="post-content">{content}</p>
      {is_aviso && <span className="post-aviso">AVISO</span>}
    </div>
  );
};

export default Post;
