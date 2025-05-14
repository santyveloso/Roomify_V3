import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="register-container">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}

export default RegisterPage;
