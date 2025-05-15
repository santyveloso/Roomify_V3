import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import DashboardComp from '../components/DashboardComp';
import NavAposLogin from '../components/NavAposLogin';

function Dashboard() {
  return (
    <div className="page-wrapper">
      <NavAposLogin />
      <main className="login-container">
        <DashboardComp />
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
