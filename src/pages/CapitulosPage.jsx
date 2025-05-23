import { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, ListItemText, TextField, Typography, Fab
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
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useRef } from 'react';


const CapitulosPage = () => {
  const refsCapitulos = useRef({});
  const { idLibro } = useParams();
  const uid = auth.currentUser?.uid;

  const [capitulos, setCapitulos] = useState([]);
  const [mostrarEditor, setMostrarEditor] = useState({});
  const [editandoCapitulo, setEditandoCapitulo] = useState({});
  const [cambiosTemporales, setCambiosTemporales] = useState({});

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
    const nuevoCapitulo = { ...nuevo, id: docRef.id };
    setCapitulos([...capitulos, nuevoCapitulo]);
    
    // Esperamos a que el DOM se actualice antes de hacer scroll
    setTimeout(() => {
      scrollToCapitulo(docRef.id);
    }, 100);
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

  const scrollToCapitulo = (id) => {
    const element = refsCapitulos.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  const iniciarEdicion = (id) => {
    setEditandoCapitulo(prev => ({ ...prev, [id]: true }));
    const capituloActual = capitulos.find(c => c.id === id);
    setCambiosTemporales(prev => ({
      ...prev,
      [id]: { 
        titulo: capituloActual.titulo,
        resumen: capituloActual.resumen
      }
    }));
  };

  const handleCambioTemporal = (id, campo, valor) => {
    setCambiosTemporales(prev => ({
      ...prev,
      [id]: { 
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  const guardarEdicion = async (id) => {
    const cambios = cambiosTemporales[id];
    if (!cambios) return;

    // Actualizar el título
    const tituloFinal = cambios.titulo?.trim() || `Capítulo ${capitulos.findIndex(c => c.id === id) + 1}`;
    await actualizarCapitulo(id, 'titulo', tituloFinal);

    // Actualizar el resumen si hay cambios
    if (cambios.resumen !== undefined) {
      await actualizarCapitulo(id, 'resumen', cambios.resumen);
    }
    
    setEditandoCapitulo(prev => ({ ...prev, [id]: false }));
    setCambiosTemporales(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  useEffect(() => {
    cargarCapitulos();
  }, [uid, idLibro]);

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Box width="20%" bgcolor="grey.200" p={2} sx={{ overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Capítulos</Typography>
        {capitulos.map((cap, i) => (
          <Box key={cap.id} p={1} onClick={() => scrollToCapitulo(cap.id)} sx={{ cursor: 'pointer' }}>
            {`${i + 1}. ${cap.titulo}`}
          </Box>
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
                        ref={(el) => {
                          provided.innerRef(el);
                          refsCapitulos.current[cap.id] = el;
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          border: '1px solid #ccc',
                          p: 2,
                          mb: 2,
                          backgroundColor: '#fdfdfd'
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h5">
                              Capítulo {index + 1}:
                            </Typography>
                            {editandoCapitulo[cap.id] ? (
                              <TextField
                                value={cambiosTemporales[cap.id]?.titulo ?? ''}
                                onChange={(e) => handleCambioTemporal(cap.id, 'titulo', e.target.value)}
                                size="small"
                                autoFocus
                              />
                            ) : (
                              <Typography variant="h5">
                                {cap.titulo}
                              </Typography>
                            )}
                          </Box>
                          <Box>
                            {editandoCapitulo[cap.id] ? (
                              <IconButton onClick={() => guardarEdicion(cap.id)} size="small">
                                <SaveIcon />
                              </IconButton>
                            ) : (
                              <IconButton onClick={() => iniciarEdicion(cap.id)} size="small">
                                <EditIcon />
                              </IconButton>
                            )}
                            <IconButton onClick={() => eliminarCapitulo(cap.id)} size="small">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <Box sx={{ pl: 2 }}>
                          {editandoCapitulo[cap.id] ? (
                            <TextField
                              fullWidth
                              label="Resumen"
                              value={cambiosTemporales[cap.id]?.resumen || cap.resumen}
                              onChange={(e) => handleCambioTemporal(cap.id, 'resumen', e.target.value)}
                              multiline
                              rows={2}
                              margin="normal"
                            />
                          ) : (
                            <Typography variant="body1" sx={{ my: 2 }}>
                              {cap.resumen || 'Sin resumen'}
                            </Typography>
                          )}
                        </Box>

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
                            rows={20}
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

        <Fab
          color="primary"
          aria-label="add"
          onClick={agregarCapitulo}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default CapitulosPage;
