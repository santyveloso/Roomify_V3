import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import CreateHomeForm from '../components/CreateHomeForm';

function CreateHome() {
  return (
    <div className="page-wrapper">
      <main className="login-container">
        <CreateHomeForm />
      </main>
      <Footer />
    </div>
  );
}

export default CreateHome;
