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


    const subirImagen = async (archivo, idPersonaje) => {
        const nombreArchivo = `${Date.now()}-${archivo.name}`;
        const ruta = `gs://tfg-planificador-novelas.firebasestorage.app/${nombreArchivo}`;
        const storageRef = ref(storage, ruta);
        await uploadBytes(storageRef, archivo);
        const url = await getDownloadURL(storageRef);

        // Actualizar en Firestore
        const refDoc = doc(db, 'users', uid, 'projects', idLibro, 'characters', idPersonaje);
        await updateDoc(refDoc, { imagen: url });


        // Actualizar en el estado local
        setPersonajes((prev) =>
            prev.map((p) =>
                p.id === idPersonaje ? { ...p, imagen: url } : p
            )
        );
    };


    const actualizarPersonaje = async (id, campo, valor) => {
        const actualizados = personajes.map((p) =>
            p.id === id ? { ...p, [campo]: valor } : p
        );
        setPersonajes(actualizados);
    
        const ref = doc(db, 'users', uid, 'projects', idLibro, 'characters', id);
        await updateDoc(ref, { [campo]: valor });
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
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar
                                                    src={p.imagen}
                                                    alt={p.nombre}
                                                    sx={{ width: 96, height: 96, cursor: 'pointer' }}
                                                    onClick={() => document.getElementById(`input-img-${p.id}`)?.click()}
                                                />
                                                <Box flex={1}>
                                                    <TextField
                                                        fullWidth
                                                        label="Nombre"
                                                        value={p.nombre}
                                                        onChange={(e) => actualizarPersonaje(p.id, 'nombre', e.target.value)}
                                                        margin="normal"
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Rol"
                                                        value={p.rol}
                                                        onChange={(e) => actualizarPersonaje(p.id, 'rol', e.target.value)}
                                                        margin="normal"
                                                    />
                                                </Box>
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => eliminarPersonaje(p.id)}
                                                    sx={{ marginLeft: 'auto' }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>

                                            <Button onClick={() => toggleDetalles(p.id)} sx={{ mb: 1 }}>
                                                {mostrarDetalles[p.id] ? 'Ocultar detalles ▲' : 'Mostrar detalles ▼'}
                                            </Button>
                                            <Collapse in={mostrarDetalles[p.id]}>
                                                <TextField
                                                    fullWidth
                                                    label="Información General"
                                                    value={p.infoGeneral}
                                                    onChange={(e) => actualizarPersonaje(p.id, 'infoGeneral', e.target.value)}
                                                    margin="normal"
                                                    multiline
                                                    rows={3}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Descripción"
                                                    value={p.descripcion}
                                                    onChange={(e) => actualizarPersonaje(p.id, 'descripcion', e.target.value)}
                                                    margin="normal"
                                                    multiline
                                                    rows={3}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Relación con otros personajes"
                                                    value={p.relaciones}
                                                    onChange={(e) => actualizarPersonaje(p.id, 'relaciones', e.target.value)}
                                                    margin="normal"
                                                    multiline
                                                    rows={3}
                                                />
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
