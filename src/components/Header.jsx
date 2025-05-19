// Este archivo define un componente funcional de React llamado Header.
// Este componente representa el encabezado de la aplicación y contiene un título.

import { AppBar, Box, Toolbar, Typography, IconButton } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { obtenerLibroPorId } from '../services/firestore';


const Header = () => {
  const [tituloLibro, setTituloLibro] = useState('');
  const { idLibro } = useParams();
  const navigate = useNavigate();
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    const cargarTitulo = async () => {
      if (!uid || !idLibro) return;
      const libro = await obtenerLibroPorId(uid, idLibro);
      if (libro) setTituloLibro(libro.title);
    };

    cargarTitulo();
  }, [uid, idLibro]);

  return (
    <AppBar position="static" sx={{ backgroundImage: 'url(/src/assets/header.png)', backgroundSize: 'cover', backgroundPosition: 'center', height: 100 }}>
      <Toolbar sx={{ justifyContent: 'space-between', height: '100%' }}>
        {/* Logo izquierda */}
        <Box display="flex" alignItems="center" gap={1}>
          <img src="/src/assets/LogoApp.png" alt="Logo" style={{ height: 60 }} />
        </Box>

        {/* Título centro */}
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'black', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {tituloLibro}
        </Typography>

        {/* Botón derecha */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton color="inherit" onClick={() => navigate('/libros')} sx={{ color: 'black' }}>
            <MenuBookIcon />
          </IconButton>
          <Typography variant="body1" sx={{ cursor: 'pointer', color: 'black' }} onClick={() => navigate('/libros')}>
            Mis libros
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

