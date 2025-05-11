import { useEffect, useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { auth } from '../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const CapitulosPage = () => {
  const { idLibro } = useParams();
  const uid = auth.currentUser?.uid;

  const [capitulos, setCapitulos] = useState([]);
  const [capituloSeleccionado, setCapituloSeleccionado] = useState(null);
  const [mostrarEditor, setMostrarEditor] = useState(true);

  // 🧠 Cargar capítulos desde Firestore
  const cargarCapitulos = async () => {
    if (!uid || !idLibro) return;
    const ref = collection(db, 'users', uid, 'projects', idLibro, 'chapters');
    const snapshot = await getDocs(ref);
    const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCapitulos(datos);
    if (datos.length > 0) setCapituloSeleccionado(datos[0]);
  };

  // ➕ Agregar nuevo capítulo
  const agregarCapitulo = async () => {
    const nuevo = {
      titulo: `Capítulo ${capitulos.length + 1}`,
      resumen: '',
      contenido: '',
    };
    const ref = collection(db, 'users', uid, 'projects', idLibro, 'chapters');
    const docRef = await addDoc(ref, nuevo);
    const nuevoConId = { ...nuevo, id: docRef.id };
    setCapitulos([...capitulos, nuevoConId]);
    setCapituloSeleccionado(nuevoConId);
  };

  // 💾 Actualizar capítulo en Firestore
  const actualizarCapitulo = async (campo, valor) => {
    if (!capituloSeleccionado) return;

    const actualizado = { ...capituloSeleccionado, [campo]: valor };
    setCapituloSeleccionado(actualizado);
    setCapitulos((prev) =>
      prev.map((c) => (c.id === actualizado.id ? actualizado : c))
    );

    const ref = doc(db, 'users', uid, 'projects', idLibro, 'chapters', actualizado.id);
    await updateDoc(ref, { [campo]: valor });
  };

  useEffect(() => {
    cargarCapitulos();
  }, [uid, idLibro]);

  return (
    <Box display="flex" height="100vh">
      {/* Lista lateral */}
      <Box width="25%" bgcolor="grey.200" p={2}>
        <Typography variant="h6" gutterBottom>Capítulos</Typography>
        <List>
          {capitulos.map((capitulo) => (
            <ListItem
              key={capitulo.id}
              button
              selected={capituloSeleccionado?.id === capitulo.id}
              onClick={() => setCapituloSeleccionado(capitulo)}
            >
              <ListItemText primary={capitulo.titulo} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Sección principal */}
      <Box flex={1} p={2}>
        {capituloSeleccionado ? (
          <>
            <TextField
              fullWidth
              label="Título"
              value={capituloSeleccionado.titulo}
              onChange={(e) => actualizarCapitulo('titulo', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Resumen"
              value={capituloSeleccionado.resumen}
              onChange={(e) => actualizarCapitulo('resumen', e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
            <Button onClick={() => setMostrarEditor(!mostrarEditor)} sx={{ mb: 2 }}>
              {mostrarEditor ? 'Contenido ▲' : 'Contenido ▼'}
            </Button>
            {mostrarEditor && (
              <TextField
                fullWidth
                label="Contenido"
                value={capituloSeleccionado.contenido}
                onChange={(e) => actualizarCapitulo('contenido', e.target.value)}
                margin="normal"
                multiline
                rows={10}
              />
            )}
          </>
        ) : (
          <Typography variant="h6">Selecciona o crea un capítulo</Typography>
        )}
        <Button variant="contained" onClick={agregarCapitulo} fullWidth sx={{ mt: 2 }}>
          Añadir capítulo
        </Button>
      </Box>
    </Box>
  );
};

export default CapitulosPage;
