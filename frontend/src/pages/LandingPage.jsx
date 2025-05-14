import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StepsSection from '../components/StepsSection';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <HeroSection />
      <StepsSection />
      <Footer />
    </div>
  );
}

export default LandingPage; 