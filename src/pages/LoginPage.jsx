/**
 * Página de Autenticación
 * 
 * Este componente maneja tanto el inicio de sesión como el registro de usuarios.
 * Características principales:
 * - Formulario dual (login/registro) con cambio dinámico
 * - Validación de correo y contraseña
 * - Integración con Firebase Authentication
 * - Redirección automática tras autenticación exitosa
 * - Diseño responsivo y amigable
 */

import { useState } from 'react';
import { registrarUsuario, iniciarSesion } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import LogoApp from '../assets/LogoApp.png';

const LoginPage = () => {
  // Estados para manejar el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario
   * Realiza el registro o inicio de sesión según el modo actual
   * y redirige al usuario a la página de libros si es exitoso
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoRegistro) {
        await registrarUsuario(email, password);
      } else {
        await iniciarSesion(email, password);
      }
      navigate('/libros');
    } catch (error) {
      alert('Error de autenticación: ' + error.message);
    }
  };

  return (
    // Contenedor principal con fondo gris claro
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Logo de la aplicación */}
      <img 
        src={LogoApp} 
        alt="Logo de la aplicación" 
        style={{
          width: '200px',
          marginBottom: '2rem'
        }}
      />
      {/* Tarjeta del formulario */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Título dinámico según el modo */}
        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#333'
        }}>
          {modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
        </h2>
        {/* Formulario de autenticación */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Campo de correo electrónico */}
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          {/* Campo de contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          {/* Botón de envío */}
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {modoRegistro ? 'Registrarse' : 'Entrar'}
          </button>
        </form>
        {/* Enlace para cambiar entre modos de registro y login */}
        <p style={{ 
          textAlign: 'center', 
          marginTop: '1rem',
          color: '#666' 
        }}>
          {modoRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button 
            onClick={() => setModoRegistro(!modoRegistro)}
            style={{
              background: 'none',
              border: 'none',
              color: '#4CAF50',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {modoRegistro ? 'Iniciar sesión' : 'Crear una'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
