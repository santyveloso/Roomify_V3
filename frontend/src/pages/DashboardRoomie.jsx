import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import DashboardRoomieComp from '../components/DashboardRoomieComp';
import NavAposLogin from '../components/NavAposLogin';

function DashboardRoomie() {
  return (
    <div className="page-wrapper">
      <NavAposLogin />
      <main className="login-container">
        <DashboardRoomieComp />
      </main>
      <Footer />
    </div>
  );
}

export default DashboardRoomie;
