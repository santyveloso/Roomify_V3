// src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import navbarLogo from '../images/navbar-logo.png';
import perfilImg from '../images/perfil.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();

  // dados do user de sessao a aparecer no nav

  const navLinks = [
    { label: 'Sobre', to: '/sobre' },
    { label: 'Funcionalidades', to: '/funcionalidades' },
    { label: 'Suporte', to: '/suporte' },
  ];

  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const PROFILE_URL = 'http://localhost:8000/backend/users/profile/';

  useEffect(() => {
    axios.get(PROFILE_URL, { withCredentials: true })
      .then(res => {
        setUsername(res.data.username || '');
        if (res.data.profile_picture) {
          setProfilePicture('http://localhost:8000' + res.data.profile_picture);
        } else {
          setProfilePicture('');
        }
      })
      .catch(err => {
        setUsername('');
        setProfilePicture('');
        console.error('Erro a obter perfil:', err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/landingpage');
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

        {/* Perfil + Logout + Theme Toggle */}
        <div
          className="navbar-actions"
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <ThemeToggle />
          <button className="navbar-cta-button" onClick={handleLogout}>
            Logout
          </button>
          <span style={{ fontWeight: '500' }}>{username}</span>

          <Link
            to="/verperfil"
            className="navbar-profile-icon"
            scroll={el => el.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Ver perfil"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img
              src={profilePicture || perfilImg}
              alt="Perfil"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}