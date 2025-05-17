import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import CriarTarefaForm from '../components/CriarTarefaForm';
import NavAposLogin from '../components/NavAposLogin';
import CreateExpenseForm from '../components/CreateExpenseForm';
import { useLocation } from 'react-router-dom';

function CriarDespesa() {
  const location = useLocation();
  const houseId = location.state?.houseId;
  return (
    <div className="page-wrapper">
      <NavAposLogin />
      <main className="register-container">
        <CreateExpenseForm houseId={houseId} />

      </main>
      <Footer />
    </div>
  );
}

export default CriarDespesa;
