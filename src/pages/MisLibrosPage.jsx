// Página principal que muestra la lista de libros del usuario
// Permite crear nuevos libros y navegar a los detalles de cada libro
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Container, Typography, Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import LibroCard from '../components/LibroCard';
import NuevoLibroForm from '../components/NuevoLibroForm';
import { getUserBooks } from '../services/firestore';
import { auth } from '../firebase/config';
import { getAuth } from "firebase/auth";
import AddIcon from '@mui/icons-material/Add';

const MisLibrosPage = () => {
  // Estados para manejar la lista de libros y el diálogo de creación
  const [libros, setLibros] = useState([]);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;

  // Función para cargar los libros del usuario desde Firestore
  const cargarLibros = useCallback(() => {
    if (!uid) return;
    getUserBooks(uid).then(setLibros).catch(console.error);
  }, [uid]);

  // Efecto para cargar los libros cuando el componente se monta
  useEffect(() => {
    cargarLibros();
  }, [cargarLibros]);

  // Efecto para obtener el token de autenticación
  useEffect(() => {
    getAuth().currentUser?.getIdToken().then(token => {
      console.log("Token de usuario:", token);
    });
  }, []);

  // Navega a la vista de capítulos del libro seleccionado
  const handleSeleccionarLibro = (idLibro) => {
    navigate(`/libros/${idLibro}/capitulos`);
  };

  // Maneja la eliminación de un libro
  const handleEliminarLibro = async (idLibro) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este libro?");
    if (!confirmacion) return;
  
    try {
      const token = await auth.currentUser.getIdToken();
  
      const res = await fetch(`http://localhost:3001/api/libros/${idLibro}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (res.ok) {
        alert("Libro eliminado correctamente");
        cargarLibros(); 
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error eliminando libro:", error);
      alert("Error en la conexión con el servidor.");
    }
  };

  // Funciones para controlar el diálogo de creación de libro
  const abrirDialogo = () => {
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
  };

  const handleLibroCreado = () => {
    cerrarDialogo();
    cargarLibros();
  };

  const handleEditarLibro = async (idLibro, datos) => {
    try {
      const token = await auth.currentUser.getIdToken();
      
      const res = await fetch(`http://localhost:3001/api/libros/${idLibro}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar el libro');
      }

      cargarLibros(); // Recargar la lista después de actualizar
    } catch (error) {
      console.error("Error editando libro:", error);
      alert("Error al editar el libro.");
    }
  };

  // Renderiza un mensaje de carga si no hay usuario autenticado
  if (!uid) return <p>Cargando usuario...</p>;

  // Renderizado del componente
  return (
    <Container sx={{ mt: 4 }}>
      {/* Encabezado con título y botón para crear nuevo libro */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Mis Libros</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={abrirDialogo}
        >
          Nuevo Libro
        </Button>
      </Box>

      {/* Diálogo modal para crear nuevo libro */}
      <Dialog open={dialogoAbierto} onClose={cerrarDialogo} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Libro</DialogTitle>
        <DialogContent>
          <NuevoLibroForm uid={uid} onLibroCreado={handleLibroCreado} />
        </DialogContent>
      </Dialog>

      {/* Grid de tarjetas de libros */}
      <Grid container spacing={2}>
        {libros.map((libro) => (
          <Grid key={libro.id}>
            <LibroCard 
              libro={libro} 
              onClick={handleSeleccionarLibro} 
              onEliminar={() => handleEliminarLibro(libro.id)}
              onEditar={handleEditarLibro}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MisLibrosPage;
