// Página para gestionar los capítulos de un libro
// Permite crear, editar, eliminar y reordenar capítulos

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
  // Referencias para el scroll automático a capítulos
  const refsCapitulos = useRef({});
  const { idLibro } = useParams();
  const uid = auth.currentUser?.uid;

  // Estados para manejar los capítulos y la interfaz
  const [capitulos, setCapitulos] = useState([]);
  const [mostrarEditor, setMostrarEditor] = useState({});
  const [editandoCapitulo, setEditandoCapitulo] = useState({});
  const [cambiosTemporales, setCambiosTemporales] = useState({});

  // Carga los capítulos desde Firestore ordenados por el campo 'orden'
  const cargarCapitulos = async () => {
    if (!uid || !idLibro) return;
    const ref = collection(db, 'users', uid, 'projects', idLibro, 'chapters');
    const q = query(ref, orderBy('orden', 'asc'));
    const snapshot = await getDocs(q);
    const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCapitulos(datos);
  };

  // Crea un nuevo capítulo al final de la lista
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

  // Actualiza un campo específico de un capítulo
  const actualizarCapitulo = async (id, campo, valor) => {
    try {
      // Primero actualizar en Firestore
      const ref = doc(db, 'users', uid, 'projects', idLibro, 'chapters', id);
      await updateDoc(ref, { [campo]: valor });
      
      // Después actualizar el estado local
      setCapitulos(prev => prev.map(c => 
        c.id === id ? { ...c, [campo]: valor } : c
      ));
    } catch (error) {
      console.error('Error al actualizar capítulo:', error);
    }
  };

  // Elimina un capítulo después de confirmar con el usuario
  const eliminarCapitulo = async (id) => {
    if (!confirm("¿Eliminar este capítulo?")) return;
    const ref = doc(db, 'users', uid, 'projects', idLibro, 'chapters', id);
    await deleteDoc(ref);
    cargarCapitulos();
  };

  // Muestra/oculta el editor de contenido de un capítulo
  const toggleEditor = (id) => {
    setMostrarEditor(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Desplaza la vista al capítulo especificado
  const scrollToCapitulo = (id) => {
    const element = refsCapitulos.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Maneja el reordenamiento de capítulos mediante drag and drop
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

  // Inicia el modo de edición de un capítulo
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

  // Maneja los cambios temporales antes de guardar
  const handleCambioTemporal = (id, campo, valor) => {
    setCambiosTemporales(prev => ({
      ...prev,
      [id]: { 
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  // Guarda los cambios realizados en el modo de edición
  const guardarEdicion = async (id) => {
    const cambios = cambiosTemporales[id];
    if (!cambios) return;

    try {
      // Crear un objeto con todos los cambios
      const actualizaciones = {};
      
      // Actualizar el título
      const tituloFinal = cambios.titulo?.trim() || `Capítulo ${capitulos.findIndex(c => c.id === id) + 1}`;
      actualizaciones.titulo = tituloFinal;
      
      // Actualizar el resumen si hay cambios
      if (cambios.resumen !== undefined) {
        actualizaciones.resumen = cambios.resumen;
      }

      // Actualizar todo en una sola operación
      const ref = doc(db, 'users', uid, 'projects', idLibro, 'chapters', id);
      await updateDoc(ref, actualizaciones);
      
      // Actualizar el estado local
      setCapitulos(prev => prev.map(c => 
        c.id === id ? { ...c, ...actualizaciones } : c
      ));

      // Limpiar el estado de edición
      setEditandoCapitulo(prev => ({ ...prev, [id]: false }));
      setCambiosTemporales(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } catch (error) {
      console.error('Error al guardar la edición:', error);
    }
  };

  // Carga inicial de capítulos
  useEffect(() => {
    cargarCapitulos();
  }, [uid, idLibro]);

  return (
    <Box display="flex" height="100vh">
      {/* Barra lateral con navegación rápida a capítulos */}
      <Box width="20%" bgcolor="grey.200" p={2} sx={{ overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>Capítulos</Typography>
        {capitulos.map((cap, i) => (
          <Box key={cap.id} p={1} onClick={() => scrollToCapitulo(cap.id)} sx={{ cursor: 'pointer' }}>
            {`${i + 1}. ${cap.titulo}`}
          </Box>
        ))}
      </Box>

      {/* Área principal de contenido */}
      <Box flex={1} p={2} sx={{ overflowY: 'auto' }}>
        {/* Contexto para el drag and drop de capítulos */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="capitulos">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {/* Lista de capítulos arrastrables */}
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
                        {/* Encabezado del capítulo con título y botones de acción */}
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
                          {/* Botones de editar/guardar y eliminar */}
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

                        {/* Sección de resumen del capítulo */}
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

                        {/* Botón y editor de contenido expandible */}
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

        {/* Botón flotante para añadir nuevo capítulo */}
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
