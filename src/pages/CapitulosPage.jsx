import { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, ListItemText, TextField, Typography
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { auth } from '../firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';

const CapitulosPage = () => {
  const { idLibro } = useParams();
  const uid = auth.currentUser?.uid;

  const [capitulos, setCapitulos] = useState([]);
  const [mostrarEditor, setMostrarEditor] = useState({});

  const cargarCapitulos = async () => {
    if (!uid || !idLibro) return;
    const ref = collection(db, 'users', uid, 'projects', idLibro, 'chapters');
    const q = query(ref, orderBy('orden', 'asc'));
    const snapshot = await getDocs(q);
    const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCapitulos(datos);
  };

  const agregarCapitulo = async () => {
    const nuevo = {
      titulo: `Capítulo ${capitulos.length + 1}`,
      resumen: '',
      contenido: '',
      orden: capitulos.length,
    };
    const ref = collection(db, 'users', uid, 'projects', idLibro, 'chapters');
    const docRef = await addDoc(ref, nuevo);
    setCapitulos([...capitulos, { ...nuevo, id: docRef.id }]);
  };

  const actualizarCapitulo = async (id, campo, valor) => {
    const actualizado = capitulos.map((c) =>
      c.id === id ? { ...c, [campo]: valor } : c
    );
    setCapitulos(actualizado);
    const ref = doc(db, 'users', uid, 'projects', idLibro, 'chapters', id);
    await updateDoc(ref, { [campo]: valor });
  };

  const eliminarCapitulo = async (id) => {
    if (!confirm("¿Eliminar este capítulo?")) return;
    const ref = doc(db, 'users', uid, 'projects', idLibro, 'chapters', id);
    await deleteDoc(ref);
    cargarCapitulos();
  };

  const toggleEditor = (id) => {
    setMostrarEditor(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 🔁 Manejar reordenamiento
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(capitulos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    // Actualiza localmente
    setCapitulos(items);

    // Actualiza en Firestore (batch)
    const batch = writeBatch(db);
    items.forEach((cap, index) => {
      const ref = doc(db, 'users', uid, 'projects', idLibro, 'chapters', cap.id);
      batch.update(ref, { orden: index });
    });
    await batch.commit();
  };

  useEffect(() => {
    cargarCapitulos();
  }, [uid, idLibro]);

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Box width="25%" bgcolor="grey.200" p={2} sx={{ overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Capítulos</Typography>
        {capitulos.map((cap, i) => (
          <Box key={cap.id} p={1}>{`${i + 1}. ${cap.titulo}`}</Box>
        ))}
      </Box>

      {/* Zona principal */}
      <Box flex={1} p={2} sx={{ overflowY: 'auto' }}>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="capitulos">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {capitulos.map((cap, index) => (
                  <Draggable key={cap.id} draggableId={cap.id} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          border: '1px solid #ccc',
                          p: 2,
                          mb: 2,
                          backgroundColor: '#fdfdfd'
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h5">Capítulo {index + 1}</Typography>
                          <IconButton onClick={() => eliminarCapitulo(cap.id)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        <TextField
                          fullWidth
                          label="Título"
                          value={cap.titulo}
                          onChange={(e) => actualizarCapitulo(cap.id, 'titulo', e.target.value)}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          label="Resumen"
                          value={cap.resumen}
                          onChange={(e) => actualizarCapitulo(cap.id, 'resumen', e.target.value)}
                          margin="normal"
                          multiline
                          rows={2}
                        />
                        <Button onClick={() => toggleEditor(cap.id)} sx={{ mb: 1 }}>
                          {mostrarEditor[cap.id] ? 'Contenido ▲' : 'Contenido ▼'}
                        </Button>
                        {mostrarEditor[cap.id] && (
                          <TextField
                            fullWidth
                            label="Contenido"
                            value={cap.contenido}
                            onChange={(e) => actualizarCapitulo(cap.id, 'contenido', e.target.value)}
                            margin="normal"
                            multiline
                            rows={6}
                          />
                        )}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button variant="contained" onClick={agregarCapitulo} fullWidth sx={{ mt: 3 }}>
          Añadir nuevo capítulo
        </Button>
      </Box>
    </Box>
  );
};

export default CapitulosPage;
