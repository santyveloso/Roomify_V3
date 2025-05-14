import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Funcionalidades', path: '/funcionalidades' },
    { name: 'Suporte', path: '/suporte' },
    { name: 'Login', path: '/login' }
  ];
  
  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com/roomify' },
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com/roomify' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/roomify' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <ul>
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Email: info@roomify.com</p>
          <p>Telefone: +351 123 456 789</p>
        </div>
        
        <div className="footer-section">
          <h3>Social</h3>
          <div className="social-icons">
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <span className="social-icon">{social.icon}</span>
                <span className="social-name">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} RoomiFy. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer; 