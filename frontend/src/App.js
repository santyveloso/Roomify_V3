import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateHome from "./pages/CreateHomePrev";
import JoinHome from "./pages/JoinHome";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerPerfil from './pages/VerPerfil';
import CreateExpenseForm from './components/CreateExpenseForm';
import Ups from './pages/Ups';
import EditarPerfil from './components/EditarPerfilComp';
import VerEditarPerfil from './components/VerEditarPerfil';
import CriarTarefa from './pages/CriarTarefa';
import CriarDespesa from './pages/CriarDespesa';
import CreateHomePrev from './pages/CreateHomePrev';
import CriarCasa from './pages/CriarCasa';
import AdminTesteViews from './pages/AdminTesteViews';

function App() {
  return (
    <Router>
      <Routes>
        /*
        //<Route path="/landingpage" element={<LandingPage />} />
        */
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-home-prev" element={<CreateHomePrev />} />
        <Route path="/join-home" element={<JoinHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/verperfil" element={<VerPerfil />} /> */}
        <Route path="/verperfil" element={<VerEditarPerfil />} />
        <Route path="/ups" element={<Ups />} />
        <Route path="/editarperfil" element={<EditarPerfil />} />
        <Route path="/criartarefa" element={<CriarTarefa />} />
        <Route path="/criardespesa" element={<CreateExpenseForm />} />
        <Route path="/criarcasa" element={<CriarCasa />} />




        //testeeee
        <Route path="/admintesteviews" element={<AdminTesteViews />} />
        <Route path="/houses/:houseId" element={<AdminTesteViews />} />



        {/* // Isto foi só pra testar n é suposto estar aqui nas pages
        <Route path="/teste-expense" element={<CreateExpenseForm houseId={1} roomies={[
          { id: 1, username: 'Ana' },
          { id: 2, username: 'João' },
          { id: 3, username: 'Maria' }
        ]} />} /> */}


      </Routes>
    </Router>
  );
}

export default App;
