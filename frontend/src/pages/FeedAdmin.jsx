import React from 'react';
import { useParams } from 'react-router-dom'; // 👈 importa isto
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NavAposLogin from '../components/NavAposLogin';
import FeedAdminComp from '../components/FeedAdminComp';
import CriarTarefaForm from '../components/CriarTarefaForm';

function FeedAdmin() {
  const { houseId } = useParams(); // 👈 apanha o ID da URL

  return (
    <div className="page-wrapper">
      <NavAposLogin />
      <main className="login-container">
        {/* 👇 passas o ID como prop para o componente */}
        <FeedAdminComp houseId={houseId} />
      </main>
      <Footer />
    </div>
  );
}

export default FeedAdmin;
