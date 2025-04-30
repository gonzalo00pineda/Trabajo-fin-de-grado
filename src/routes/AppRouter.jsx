import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import MisLibrosPage from '../pages/MisLibrosPage';
import CapitulosPage from '../pages/CapitulosPage';
import PersonajesPage from '../pages/PersonajesPage';
import LineaTemporalPage from '../pages/LineaTemporalPage';
import MagiaPage from '../pages/MagiaPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/libros" element={<MisLibrosPage />} />
        <Route path="/capitulos" element={<CapitulosPage />} />
        <Route path="/personajes" element={<PersonajesPage />} />
        <Route path="/linea-temporal" element={<LineaTemporalPage />} />
        <Route path="/magia" element={<MagiaPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
