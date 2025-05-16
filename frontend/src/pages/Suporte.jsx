import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import '../Auth.css'
import SuporteComp from  '../components/SuporteComp'

function Suporte() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="login-container">
        <SuporteComp />
      </main>
      <Footer />
    </div>
  );
}

export default Suporte;
