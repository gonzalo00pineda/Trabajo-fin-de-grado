// Importaciones de React y Material-UI
import { useState, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Avatar,
    Collapse,
    Fab
} from '@mui/material';

// Importación de iconos necesarios para la interfaz
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

// Recursos y configuraciones
import defaultImage from '../assets/default-character.png';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { crearPersonaje } from '../services/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect } from 'react';
import { cargarPersonajes } from '../services/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const PersonajesPage = () => {
    // Estados para gestionar los personajes y la interfaz
    const [personajes, setPersonajes] = useState([]); // Lista de personajes
    const [busqueda, setBusqueda] = useState(''); // Texto para filtrar personajes
    const [mostrarDetalles, setMostrarDetalles] = useState({}); // Control de expansión de detalles
    const [editandoPersonaje, setEditandoPersonaje] = useState({}); // Control de modo edición
    const [cambiosTemporales, setCambiosTemporales] = useState({}); // Almacena cambios antes de guardar
    
    // Referencias y parámetros
    const refsPersonajes = useRef({}); // Referencias para scroll
    const { idLibro } = useParams(); // ID del libro actual
    const auth = getAuth();
    const uid = auth.currentUser?.uid; // ID del usuario actual

    // Función para crear un nuevo personaje
    const agregarPersonaje = async () => {
        const nuevo = {
            nombre: 'Nuevo Personaje',
            rol: '',
            descripcion: '',
            infoGeneral: '',
            relaciones: '',
            imagen: defaultImage
        };

        const personajeCreado = await crearPersonaje(uid, idLibro, nuevo);
        setPersonajes([...personajes, personajeCreado]);
    };

    // Función para actualizar datos de un personaje
    const actualizarPersonaje = async (id, campo, valor) => {
        const ref = doc(db, 'users', uid, 'projects', idLibro, 'characters', id);
        await updateDoc(ref, { [campo]: valor });
        setPersonajes(prev => prev.map(p => 
            p.id === id ? { ...p, [campo]: valor } : p
        ));
    };

    // Función para subir y actualizar la imagen de un personaje
    const subirImagen = async (archivo, idPersonaje) => {
        const nombreArchivo = `${Date.now()}-${archivo.name}`;
        const ruta = `gs://tfg-planificador-novelas.firebasestorage.app/${nombreArchivo}`;
        const storageRef = ref(storage, ruta);
        await uploadBytes(storageRef, archivo);
        const url = await getDownloadURL(storageRef);
        await actualizarPersonaje(idPersonaje, 'imagen', url);
    };

    // Función para guardar cambios después de editar
    const guardarEdicion = async (id) => {
        const cambios = cambiosTemporales[id];
        if (!cambios) return;

        try {
            const actualizaciones = Object.entries(cambios).map(([campo, valor]) => 
                actualizarPersonaje(id, campo, valor)
            );
            
            await Promise.all(actualizaciones);
            setEditandoPersonaje(prev => ({ ...prev, [id]: false }));
            setCambiosTemporales(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
        }
    };

    // Función para mostrar/ocultar detalles de un personaje
    const toggleDetalles = (id) => {
        setMostrarDetalles((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Filtrado de personajes según el texto de búsqueda
    const personajesFiltrados = personajes.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Función para eliminar un personaje
    const eliminarPersonaje = async (idPersonaje) => {
        const personajeRef = doc(db, `users/${uid}/projects/${idLibro}/characters`, idPersonaje);
        await deleteDoc(personajeRef);
        setPersonajes((prev) => prev.filter((p) => p.id !== idPersonaje));
    };

    // Función para manejar el reordenamiento de personajes
    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(personajes);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        setPersonajes(items);

        const batch = writeBatch(db);
        items.forEach((personaje, index) => {
            const ref = doc(db, 'users', uid, 'projects', idLibro, 'characters', personaje.id);
            batch.update(ref, { orden: index });
        });
        await batch.commit();
    };

    // Función para iniciar la edición de un personaje
    const iniciarEdicion = (id) => {
        setEditandoPersonaje(prev => ({ ...prev, [id]: true }));
        const personajeActual = personajes.find(p => p.id === id);
        setCambiosTemporales(prev => ({
            ...prev,
            [id]: {
                nombre: personajeActual.nombre,
                rol: personajeActual.rol,
                infoGeneral: personajeActual.infoGeneral,
                descripcion: personajeActual.descripcion,
                relaciones: personajeActual.relaciones
            }
        }));
    };

    // Función para manejar cambios en los campos durante la edición
    const handleCambioTemporal = (id, campo, valor) => {
        setCambiosTemporales(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [campo]: valor
            }
        }));
    };

    // Efecto para cargar los personajes al montar el componente
    useEffect(() => {
        const obtenerPersonajes = async () => {
            if (!uid || !idLibro) return;
            const datos = await cargarPersonajes(uid, idLibro);
            setPersonajes(datos);
        };
    
        obtenerPersonajes();
    }, [uid, idLibro]);

    return (
        <Box display="flex" height="100vh">
            {/* Barra lateral: Navegación rápida y búsqueda de personajes */}
            <Box width="20%" bgcolor="grey.200" p={2} sx={{ overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>Personajes</Typography>
                {/* Campo de búsqueda para filtrar personajes */}
                <TextField
                    fullWidth
                    placeholder="Buscar personajes"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    sx={{ mb: 2 }}
                />
                {/* Lista de personajes con scroll automático */}
                <List>
                    {personajesFiltrados.map((p) => (
                        <ListItem
                            key={p.id}
                            button="true"
                            onClick={() => refsPersonajes.current[p.id]?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <ListItemText primary={p.nombre} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Sección principal: Lista de tarjetas de personajes */}
            <Box flex={1} p={2} sx={{ overflowY: 'auto' }}>
                {/* Contexto para drag and drop */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="personajes">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {personajes.map((p, index) => (
                                    <Draggable key={p.id} draggableId={p.id} index={index}>
                                        {(provided) => (
                                            <Box
                                                ref={(el) => {
                                                    provided.innerRef(el);
                                                    refsPersonajes.current[p.id] = el;
                                                }}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{ border: '1px solid #ccc', p: 2, mb: 2, backgroundColor: '#fdfdfd' }}
                                            >
                                                {/* Cabecera del personaje: imagen, nombre y rol */}
                                                <Box display="flex" justifyContent="space-between" alignItems="start">
                                                    <Box display="flex" alignItems="center" gap={2} flex={1}>
                                                        {/* Avatar con función de actualización en modo edición */}
                                                        <Avatar
                                                            src={p.imagen}
                                                            alt={p.nombre}
                                                            sx={{ width: 96, height: 96, cursor: editandoPersonaje[p.id] ? 'pointer' : 'default' }}
                                                            onClick={() => editandoPersonaje[p.id] && document.getElementById(`input-img-${p.id}`)?.click()}
                                                        />
                                                        {/* Contenedor de información básica */}
                                                        <Box flex={1}>
                                                            {/* Nombre del personaje (modo edición/visualización) */}
                                                            {editandoPersonaje[p.id] ? (
                                                                <TextField
                                                                    fullWidth
                                                                    value={cambiosTemporales[p.id]?.nombre || p.nombre}
                                                                    onChange={(e) => handleCambioTemporal(p.id, 'nombre', e.target.value)}
                                                                    margin="normal"
                                                                />
                                                            ) : (
                                                                <Typography variant="h5" sx={{ mt: 1 }}>
                                                                    {p.nombre}
                                                                </Typography>
                                                            )}
                                                            {/* Rol del personaje (modo edición/visualización) */}
                                                            {editandoPersonaje[p.id] ? (
                                                                <TextField
                                                                    fullWidth
                                                                    label="Rol"
                                                                    value={cambiosTemporales[p.id]?.rol || p.rol}
                                                                    onChange={(e) => handleCambioTemporal(p.id, 'rol', e.target.value)}
                                                                    margin="normal"
                                                                />
                                                            ) : (
                                                                <Typography color="textSecondary">
                                                                    {p.rol || 'Sin rol asignado'}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                    {/* Botones de acción (editar/guardar y eliminar) */}
                                                    <Box>
                                                        {editandoPersonaje[p.id] ? (
                                                            <IconButton onClick={() => guardarEdicion(p.id)}>
                                                                <SaveIcon />
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton onClick={() => iniciarEdicion(p.id)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        )}
                                                        <IconButton onClick={() => eliminarPersonaje(p.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>

                                                {/* Botón para expandir/contraer detalles */}
                                                <Button onClick={() => toggleDetalles(p.id)} sx={{ mb: 1 }}>
                                                    {mostrarDetalles[p.id] ? 'Ocultar detalles ▲' : 'Mostrar detalles ▼'}
                                                </Button>

                                                {/* Sección expandible con detalles adicionales */}
                                                <Collapse in={mostrarDetalles[p.id]}>
                                                    {editandoPersonaje[p.id] ? (
                                                        <>
                                                            {/* Campos de edición para detalles adicionales */}
                                                            <TextField
                                                                fullWidth
                                                                label="Información General"
                                                                value={cambiosTemporales[p.id]?.infoGeneral || p.infoGeneral}
                                                                onChange={(e) => handleCambioTemporal(p.id, 'infoGeneral', e.target.value)}
                                                                margin="normal"
                                                                multiline
                                                                rows={3}
                                                            />
                                                            <TextField
                                                                fullWidth
                                                                label="Descripción"
                                                                value={cambiosTemporales[p.id]?.descripcion || p.descripcion}
                                                                onChange={(e) => handleCambioTemporal(p.id, 'descripcion', e.target.value)}
                                                                margin="normal"
                                                                multiline
                                                                rows={3}
                                                            />
                                                            <TextField
                                                                fullWidth
                                                                label="Relación con otros personajes"
                                                                value={cambiosTemporales[p.id]?.relaciones || p.relaciones}
                                                                onChange={(e) => handleCambioTemporal(p.id, 'relaciones', e.target.value)}
                                                                margin="normal"
                                                                multiline
                                                                rows={3}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Visualización de detalles adicionales */}
                                                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                                                Información General:
                                                            </Typography>
                                                            <Typography paragraph>
                                                                {p.infoGeneral || 'Sin información general'}
                                                            </Typography>
                                                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                                                Descripción:
                                                            </Typography>
                                                            <Typography paragraph>
                                                                {p.descripcion || 'Sin descripción'}
                                                            </Typography>
                                                            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                                                Relaciones:
                                                            </Typography>
                                                            <Typography paragraph>
                                                                {p.relaciones || 'Sin relaciones definidas'}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Collapse>
                                                {/* Input oculto para la subida de imágenes */}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id={`input-img-${p.id}`}
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        const archivo = e.target.files[0];
                                                        if (archivo) subirImagen(archivo, p.id);
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {/* Botón flotante para añadir nuevo personaje */}
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={agregarPersonaje}
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                >
                    <AddIcon />
                </Fab>
            </Box>
        </Box>
    );
};

export default PersonajesPage;
