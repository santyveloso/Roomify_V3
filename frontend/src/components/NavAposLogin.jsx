// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import navbarLogo from '../images/navbar-logo.png';
import perfilImg from '../images/perfil.png';

export default function Navbar() {
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Sobre', to: '/sobre' },
    { label: 'Funcionalidades', to: '/funcionalidades' },
    { label: 'Suporte', to: '/suporte' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

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

        {/* Perfil + Logout */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
          <button className="navbar-cta-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
