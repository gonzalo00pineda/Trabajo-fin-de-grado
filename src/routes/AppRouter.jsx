/**
 * Configuración de Rutas de la Aplicación
 * 
 * Este componente define la estructura de navegación principal de la aplicación.
 * Gestiona todas las rutas disponibles y su jerarquía, incluyendo:
 * - Rutas públicas (homepage, login)
 * - Rutas protegidas (gestión de libros)
 * - Rutas anidadas para la gestión de cada libro individual
 * 
 * La estructura de rutas está organizada para reflejar la jerarquía de la aplicación:
 * / -> Página de inicio
 * /login -> Autenticación
 * /libros -> Lista de libros del usuario
 * /libros/:idLibro/* -> Secciones específicas de cada libro
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import MisLibrosPage from '../pages/MisLibrosPage';
import CapitulosPage from '../pages/CapitulosPage';
import PersonajesPage from '../pages/PersonajesPage';
import LineaTemporalPage from '../pages/LineaTemporalPage';
import MagiaPage from '../pages/MagiaPage';
import LayoutLibro from '../layouts/LayoutLibro';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas accesibles sin autenticación */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/libros" element={<MisLibrosPage />} />
        
        {/* Rutas específicas de cada libro, comparten el layout común de LayoutLibro */}
        <Route path="/libros/:idLibro" element={<LayoutLibro />}>
          {/* Subrutas para las diferentes secciones de gestión del libro */}
          <Route path="capitulos" element={<CapitulosPage />} />
          <Route path="personajes" element={<PersonajesPage />} />
          <Route path="linea-temporal" element={<LineaTemporalPage />} />
          <Route path="magia" element={<MagiaPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

