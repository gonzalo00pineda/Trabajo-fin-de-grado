
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Container, Typography } from '@mui/material';
import LibroCard from '../components/LibroCard';
import NuevoLibroForm from '../components/NuevoLibroForm';
import { getUserBooks } from '../services/firestore';
import { auth } from '../firebase/config';
import { getAuth } from "firebase/auth";

const MisLibrosPage = () => {
  const [libros, setLibros] = useState([]);
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;


  const cargarLibros = useCallback(() => {
    if (!uid) return;
    getUserBooks(uid).then(setLibros).catch(console.error);
  }, [uid]);

  useEffect(() => {
    cargarLibros();
  }, [cargarLibros]);

  useEffect(() => {
    getAuth().currentUser?.getIdToken().then(token => {
      console.log("Token de usuario:", token);
    });
  }, []);

  const handleSeleccionarLibro = (idLibro) => {
    navigate(`/libros/${idLibro}/capitulos`);
  };

  if (!uid) return <p>Cargando usuario...</p>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Mis Libros</Typography>

      <NuevoLibroForm uid={uid} onLibroCreado={cargarLibros} />

      <Grid container spacing={2}>
        {libros.map((libro) => (
          <Grid key={libro.id}>
            <LibroCard libro={libro} onClick={handleSeleccionarLibro} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MisLibrosPage;
