import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import '../Auth.css'
import SobreComp from  '../components/SobreComp'

function Sobre() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="login-container">
        <SobreComp />
      </main>
      <Footer />
    </div>
  );
}

export default Sobre;
