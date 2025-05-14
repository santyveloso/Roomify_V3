import React from 'react';
import { Home, User, CircleCheck, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

function StepsSection() {
  const steps = [
    { 
      icon: <User size={24} />, 
      label: 'Registar',
      description: 'Cria a tua conta em segundos',
      link: '/register'
    },
    { 
      icon: <Home size={24} />, 
      label: 'Adicionar Casa',
      description: 'Configura a tua casa partilhada',
      link: '/register'  // <- página que vais criar
    },
    { 
      icon: <CircleCheck size={24} />, 
      label: 'Definir Tarefas',
      description: 'Organiza as tarefas domésticas',
      link: '/register'  // <- página que vais criar
    },
    { 
      icon: <Rocket size={24} />, 
      label: 'Começar a Usar',
      description: 'Aproveita todas as funcionalidades',
      link: '/register'  // <- ou qualquer página inicial da app
    }
  ];

  return (
    <section className="steps-section">
      <h2 className="steps-title">Comece <i>Hoje</i> Em</h2>
      <h2 className="steps-title">Apenas 4 Passos</h2>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <div className="step-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="step-icon">{step.icon}</div>
            <p className="step-description">{step.description}</p>
            <Link to={step.link} className="hero-cta-button">
              {step.label}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StepsSection;
