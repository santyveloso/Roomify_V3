import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import '../Auth.css'
import FuncComp from  '../components/FuncComp'

function Funcionalidades() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="login-container">
        <FuncComp />
      </main>
      <Footer />
    </div>
  );
}

export default Funcionalidades;
