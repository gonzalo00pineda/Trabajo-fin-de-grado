/**
 * Página de Inicio (Landing Page)
 * 
 * Este componente representa la página principal de Novplax que los usuarios
 * ven antes de autenticarse. Proporciona:
 * - Presentación de la aplicación con el logo
 * - Descripción del propósito y beneficios de la plataforma
 * - Botones de acceso para iniciar sesión y registro
 * 
 * La página utiliza un diseño limpio y minimalista para transmitir
 * profesionalismo y simplicidad, valores clave de la aplicación.
 */

import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import LogoApp from '../assets/LogoApp.png';

export default function HomePage() {
    return (
        <div className="welcome-container">
            {/* Logo y título principal */}
            <img src={LogoApp} alt="Logo Novplax" className="welcome-logo" />
            <h1>Bienvenid@ a Novplax</h1>
            
            {/* Descripción corta y llamativa */}
            <p className="welcome-description">
                Tu espacio creativo para planificar, escribir y dar vida a tus novelas.
            </p>
            
            {/* Descripción detallada de la aplicación */}
            <div className="app-description">
                <p>
                    Novplax es una herramienta diseñada para escritores que buscan una forma 
                    estructurada pero flexible de organizar sus historias. Todo está pensado para ayudarte a centrarte en lo que importa: contar tu 
                    historia.
                </p>
                <p>
                    Accede a tus proyectos desde cualquier lugar, guarda tus avances automáticamente y 
                    trabaja sin distracciones en un entorno limpio e intuitivo.
                </p>
            </div>

            {/* Botones de autenticación */}
            <div className="auth-buttons">
                <Link to="/login" className="btn-login">Iniciar sesion</Link>
                <Link to="/login" className="btn-register">Registrarse</Link>
            </div>
        </div>
    );
}