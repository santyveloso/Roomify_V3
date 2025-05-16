import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import DashboardAdminComp from '../components/DashboardAdminComp';
import NavAposLogin from '../components/NavAposLogin';

function DashboardAdmin() {
  return (
    <div className="page-wrapper">
      <NavAposLogin />
      <main className="login-container">
        <DashboardAdminComp />
      </main>
      <Footer />
    </div>
  );
}

export default DashboardAdmin;
