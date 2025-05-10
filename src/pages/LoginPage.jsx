

import { useState } from 'react';
import { registrarUsuario, iniciarSesion } from '../services/auth';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);
  const navigate = useNavigate();

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
    <div style={{ padding: '2rem' }}>
      <h2>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">{modoRegistro ? 'Registrarse' : 'Entrar'}</button>
      </form>
      <p>
        {modoRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <button onClick={() => setModoRegistro(!modoRegistro)}>
          {modoRegistro ? 'Iniciar sesión' : 'Crear una'}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
