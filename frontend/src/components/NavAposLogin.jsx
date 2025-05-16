// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import navbarLogo from '../images/navbar-logo.png';
import perfilImg from '../images/perfil.png'; // import da imagem de perfil

export default function Navbar() {
  const navLinks = [
    { label: 'Sobre', to: '/sobre' },
    { label: 'Funcionalidades', to: '/funcionalidades' },
    { label: 'Suporte', to: '/suporte' },
  ];

  return (
    <header className="navbar" role="banner">
      <div className="navbar-container">
        {/* Logo */}
        <Link
          to="/#"
          className="navbar-logo"
          scroll={el => el.scrollIntoView({ behavior: 'smooth' })}
          aria-label="RoomiFy – início"
        >
          <img src={navbarLogo} alt="RoomiFy logo" />
        </Link>

        {/* Navegação desktop */}
        <nav className="navbar-links" aria-label="Navegação principal">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              smooth
              to={to}
              scroll={el => el.scrollIntoView({ behavior: 'smooth' })}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Ícone do Perfil */}
        <div className="navbar-actions">
          <Link
            to="/verperfil"
            className="navbar-profile-icon"
            scroll={el => el.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Ver perfil"
          >
            <img
              src={perfilImg}
              alt="Perfil"
              style={{ width: '32px', height: '32px', borderRadius: '50%' }}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
