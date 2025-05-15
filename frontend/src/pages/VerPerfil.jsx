import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Perfil from '../components/Perfil';
import NavAposLogin from '../components/NavAposLogin';

function VerPerfil() {
  return (
    <div>
        <NavAposLogin />
      <main>
        <Perfil />
      </main>
      <Footer />
    </div>
  );
}

export default VerPerfil;
