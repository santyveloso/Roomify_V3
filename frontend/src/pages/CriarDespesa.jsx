import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import CriarTarefaForm from '../components/CriarTarefaForm';
import NavAposLogin from '../components/NavAposLogin';
import CriarDespesaForm from '../components/CriarDespesaForm';

function CriarDespesa() {
  return (
    <div className="page-wrapper">
      <NavAposLogin />
      <main className="register-container">
        <CriarDespesaForm />
      </main>
      <Footer />
    </div>
  );
}

export default CriarDespesa;
