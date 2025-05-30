/**
 * Componente Header
 * 
 * Este componente representa la barra de navegación superior de la aplicación.
 * Características principales:
 * - Muestra el logo de la aplicación
 * - Muestra el título del libro actual (si se está visualizando uno)
 * - Proporciona navegación rápida a la lista de libros
 * - Diseño responsivo con Material-UI
 * - Fondo personalizado con imagen
 */

import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { obtenerLibroPorId } from '../services/firestore';
import LogoApp from '../assets/LogoApp.png';
import header from '../assets/header.png';

const Header = () => {
  // Estado para almacenar el título del libro actual
  const [tituloLibro, setTituloLibro] = useState('');
  
  // Obtener el ID del libro de los parámetros de la URL
  const { idLibro } = useParams();
  
  // Hook para la navegación programática
  const navigate = useNavigate();
  
  // Obtener el ID del usuario autenticado
  const uid = getAuth().currentUser?.uid;

  // Efecto para cargar el título del libro cuando cambia el ID del libro o el usuario
  useEffect(() => {
    const cargarTitulo = async () => {
      // Solo cargar si tenemos tanto el ID del usuario como el del libro
      if (!uid || !idLibro) return;
      const libro = await obtenerLibroPorId(uid, idLibro);
      if (libro) setTituloLibro(libro.title);
    };

    cargarTitulo();
  }, [uid, idLibro]);

  return (
    <AppBar position="static" sx={{ 
      backgroundImage: `url(${header})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      height: 100,
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', height: '100%' }}>
        {/* Sección izquierda: Logo de la aplicación */}
        <Box display="flex" alignItems="center" gap={1}>
          <img src={LogoApp} alt="Logo" style={{ height: 60 }} />
        </Box>

        {/* Sección central: Título del libro actual */}
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'black', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {tituloLibro}
        </Typography>

        {/* Sección derecha: Botón de navegación a "Mis libros" */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/libros')} 
            sx={{ color: 'black' }}
          >
            <MenuBookIcon />
          </IconButton>
          <Typography 
            variant="body1" 
            sx={{ cursor: 'pointer', color: 'black' }} 
            onClick={() => navigate('/libros')}
          >
            Mis libros
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

