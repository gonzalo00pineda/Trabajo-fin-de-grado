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
import defaultImage from '../assets/default-character.png';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { crearPersonaje } from '../services/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config'; // Ajusta la ruta si es distinta
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEffect } from 'react';
import { cargarPersonajes } from '../services/firestore'



const PersonajesPage = () => {
    const [personajes, setPersonajes] = useState([]);
    /*
    const [nuevoPersonaje, setNuevoPersonaje] = useState({
        nombre: '',
        rol: '',
        descripcion: '',
        infoGeneral: '',
        relaciones: '',
        imagen: ''
    });
    */

    const [busqueda, setBusqueda] = useState('');
    const [mostrarDetalles, setMostrarDetalles] = useState({});
    const refsPersonajes = useRef({});
    const { idLibro } = useParams();
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    const fileInputRef = useRef();



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
        const ruta = `users/${uid}/projects/${idLibro}/characters/${nombreArchivo}`;
        const storageRef = ref(storage, ruta);
        await uploadBytes(storageRef, archivo);
        const url = await getDownloadURL(storageRef);

        // Actualizar en Firestore si ya está guardado (opcional)
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
            {personajes.map((p) => (
            <Box
                key={p.id}
                ref={(el) => (refsPersonajes.current[p.id] = el)}
                sx={{ border: '1px solid #ccc', p: 2, mb: 2, backgroundColor: '#fdfdfd' }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                    src={p.imagen}
                    alt={p.nombre}
                    sx={{ width: 96, height: 96 }}
                    onClick={() => fileInputRef.current?.click()}
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
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={(e) => {
                    const archivo = e.target.files[0];
                    if (archivo) subirImagen(archivo, p.id);
                }}
                />
            </Box>
            ))}

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
