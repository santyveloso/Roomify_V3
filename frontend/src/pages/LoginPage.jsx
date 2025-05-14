import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className="page-wrapper">
      <main className="login-container">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;
