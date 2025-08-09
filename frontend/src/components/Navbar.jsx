// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import navbarLogo from '../images/navbar-logo.png';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navLinks = [
    { label: 'Sobre',           to: '/sobre' },
    { label: 'Funcionalidades', to: '/funcionalidades' },
    { label: 'Suporte',         to: '/suporte' },
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

        {/* Ações */}
        <div className="navbar-actions">
          <ThemeToggle />
          <Link
            to="/login"
            className="sign-in-button"
            scroll={el => el.scrollIntoView({ behavior: 'smooth' })}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="navbar-cta-button"
            scroll={el => el.scrollIntoView({ behavior: 'smooth' })}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
);
}
