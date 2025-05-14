import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Onboarding from "./pages/Onboarding";
import CreateOrJoin from "./pages/CreateOrJoin";
import CreateHome from "./pages/CreateHome";
import JoinHome from "./pages/JoinHome";
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        /*
        //<Route path="/landingpage" element={<LandingPage />} /> 
        */
        <Route path="/" element={<Onboarding />} />
        <Route path="/create-or-join" element={<CreateOrJoin />} />
        <Route path="/create-home" element={<CreateHome />} />
        <Route path="/join-home" element={<JoinHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
