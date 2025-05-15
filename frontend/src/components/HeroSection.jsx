import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../images/hero-image.png';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">        
        <h1 className="hero-title">
          Controla A <i>Tua Casa</i> Partilhada De Forma Simples
        </h1>
        
        <p className="hero-subtitle">
          Organiza tarefas, despesas e comunicação num só sítio.
        </p>
        
        <div className="hero-buttons">
          <Link to="/create-home" className="hero-cta-button">
            Criar Casa
          </Link>
        </div>
      </div>
      
      <div className="hero-image">
        <img 
          src={heroImage}
          alt="Casa minimalista em 3D com nuvens e arbustos"
          className="hero-img"
        />
      </div>
    </section>
  );
}

export default HeroSection; 