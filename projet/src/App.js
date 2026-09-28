import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Espacetravail from './pages/espacetravail';
import Practices from './pages/Practices';
import PracticeVersionForm from './pages/Practiceversionform';
import './App.css';
import Practicemethode from './pages/prcaticemethodeassociation';
import Practicepra from './pages/Practicevspractice';
import Inscription from './pages/inscription';
import Login from './pages/Login';
import Team from './pages/creerteam';
import Mesteam from './pages/affichageteams';
import Teamdetail from './pages/Teamdetail';
import Creeruniv from './pages/creerunivers';
import Ajouterpratique from './pages/Addpractice';
import Ajouterpratiqueversion from './pages/Practiceversionform';
import MonProfil from './pages/MonProfil';




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/espace-travail/:practiceVersionId" element={<Espacetravail />} />
          <Route path="/practice/:id/version" element={<PracticeVersionForm />} /> 
          <Route path="/practices/:teamId" element={<Practices />} />
          <Route path="/practice-methods" element={<Practicemethode />} />
          <Route path="/practice-associ" element={<Practicepra />} />
          <Route path="/register" element={<Inscription />} />
          <Route path="/connect" element={<Login />} />
           <Route path="/creer-team" element={<Team />} />
           <Route path="/user-teams" element={<Mesteam/>} />
            <Route path="/user-teams" element={<Mesteam/>} />
            <Route path="/team/:id" element={<Teamdetail />} />
            <Route path="/creer-univers" element={<Creeruniv />} />
            <Route path="/ajouter-practice" element={<Ajouterpratique />} />
            <Route path="/ajouter-practice-version" element={<Ajouterpratiqueversion />} />
            <Route path="/mon-profil" element={<MonProfil />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

