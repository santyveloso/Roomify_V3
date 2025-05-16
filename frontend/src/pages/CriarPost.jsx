import React from 'react';
import { useParams } from 'react-router-dom';
import NavAposLogin from '../components/NavAposLogin';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import CriarPostForm from '../components/PostForm';

function CriarPost() {
   const location = useLocation();
   const houseId = location.state?.houseId;

  return (
    <div className="page-wrapper">
      <NavAposLogin />
      <main className="register-container">
        {houseId ? (
          <CriarPostForm houseId={houseId} />
        ) : (
          <p style={{ color: 'red', fontWeight: 'bold' }}>Erro: ID da casa não foi fornecido.</p>
        )}
      </main>
      <Footer />ss
    </div>
  );
}

export default CriarPost;
