import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import CriarTarefaForm from '../components/CriarTarefaForm';
import NavAposLogin from '../components/NavAposLogin';
import { useLocation } from 'react-router-dom';

function CriarTarefa() {
  const location = useLocation();
  const houseId = location.state?.houseId;
  return (
    <div className="page-wrapper">
      <NavAposLogin />
      <main className="register-container">
        <CriarTarefaForm houseId={houseId} />
      </main>
      <Footer />
    </div>
  );
}

export default CriarTarefa;
