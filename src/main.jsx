/**
 * Punto de Entrada de la Aplicación React
 * 
 * Este archivo es el punto de entrada principal de la aplicación React.
 * Sus responsabilidades son:
 * - Inicializar la aplicación React
 * - Montar el componente raíz en el DOM
 * - Habilitar el StrictMode para desarrollo
 * - Importar los estilos globales
 * 
 * El StrictMode ayuda a identificar problemas potenciales en la aplicación
 * realizando renderizados adicionales en desarrollo.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);
