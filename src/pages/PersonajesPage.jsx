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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import defaultImage from '../assets/default-character.png';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { crearPersonaje } from '../services/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config'; // Ajusta la ruta si es distinta
import { doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect } from 'react';
import { cargarPersonajes } from '../services/firestore'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';



const PersonajesPage = () => {
    const [personajes, setPersonajes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarDetalles, setMostrarDetalles] = useState({});
    const [editandoPersonaje, setEditandoPersonaje] = useState({});
    const [cambiosTemporales, setCambiosTemporales] = useState({});
    const refsPersonajes = useRef({});
    const { idLibro } = useParams();
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    



    const agregarPersonaje = async () => {
        const nuevo = {
            nombre: 'Nuevo Personaje', // Nombre predeterminado
            rol: '',
            descripcion: '',
            infoGeneral: '',
            relaciones: '',
            imagen: defaultImage
        };

        const personajeCreado = await crearPersonaje(uid, idLibro, nuevo);
        setPersonajes([...personajes, personajeCreado]);
    };


    const actualizarPersonaje = async (id, campo, valor) => {
        // Actualizar en Firestore primero
        const ref = doc(db, 'users', uid, 'projects', idLibro, 'characters', id);
        await updateDoc(ref, { [campo]: valor });

        // Actualizar el estado local después
        setPersonajes(prev => prev.map(p => 
            p.id === id ? { ...p, [campo]: valor } : p
        ));
    };

    const subirImagen = async (archivo, idPersonaje) => {
        const nombreArchivo = `${Date.now()}-${archivo.name}`;
        const ruta = `gs://tfg-planificador-novelas.firebasestorage.app/${nombreArchivo}`;
        const storageRef = ref(storage, ruta);
        await uploadBytes(storageRef, archivo);
        const url = await getDownloadURL(storageRef);

        // Usar actualizarPersonaje para la imagen
        await actualizarPersonaje(idPersonaje, 'imagen', url);
    };


    const guardarEdicion = async (id) => {
        const cambios = cambiosTemporales[id];
        if (!cambios) return;

        try {
            // Usar actualizarPersonaje para cada campo modificado
            const actualizaciones = Object.entries(cambios).map(([campo, valor]) => 
                actualizarPersonaje(id, campo, valor)
            );
            
            await Promise.all(actualizaciones);

            // Limpiar el estado de edición
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

    const toggleDetalles = (id) => {
        setMostrarDetalles((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const personajesFiltrados = personajes.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const eliminarPersonaje = async (idPersonaje) => {
        // Eliminar el personaje de Firestore
        const personajeRef = doc(db, `users/${uid}/projects/${idLibro}/characters`, idPersonaje);
        await deleteDoc(personajeRef);

        // Actualizar el estado local
        setPersonajes((prev) => prev.filter((p) => p.id !== idPersonaje));
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(personajes);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        // Actualiza localmente
        setPersonajes(items);

        // Actualiza en Firestore (batch)
        const batch = writeBatch(db);
        items.forEach((personaje, index) => {
            const ref = doc(db, 'users', uid, 'projects', idLibro, 'characters', personaje.id);
            batch.update(ref, { orden: index });
        });
        await batch.commit();
    };

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

    const handleCambioTemporal = (id, campo, valor) => {
        setCambiosTemporales(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [campo]: valor
            }
        }));
    };

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
            {/* Sidebar */}
            <Box width="20%" bgcolor="grey.200" p={2} sx={{ overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>Personajes</Typography>
                <TextField
                    fullWidth
                    placeholder="Buscar personajes"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    sx={{ mb: 2 }}
                />
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

            {/* Main Section */}
            <Box flex={1} p={2} sx={{ overflowY: 'auto' }}>
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
                                                <Box display="flex" justifyContent="space-between" alignItems="start">
                                                    <Box display="flex" alignItems="center" gap={2} flex={1}>
                                                        <Avatar
                                                            src={p.imagen}
                                                            alt={p.nombre}
                                                            sx={{ width: 96, height: 96, cursor: editandoPersonaje[p.id] ? 'pointer' : 'default' }}
                                                            onClick={() => editandoPersonaje[p.id] && document.getElementById(`input-img-${p.id}`)?.click()}
                                                        />
                                                        <Box flex={1}>
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

                                                <Button onClick={() => toggleDetalles(p.id)} sx={{ mb: 1 }}>
                                                    {mostrarDetalles[p.id] ? 'Ocultar detalles ▲' : 'Mostrar detalles ▼'}
                                                </Button>
                                                <Collapse in={mostrarDetalles[p.id]}>
                                                    {editandoPersonaje[p.id] ? (
                                                        <>
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
