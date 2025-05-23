import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Typography,
    Card,
    CardContent,
    IconButton,
    Button,
    Slider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Rating,
    InputAdornment
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, writeBatch, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth } from 'firebase/auth';

const LineaTemporalPage = () => {
    const [eventos, setEventos] = useState([]);
    const [numCapitulos, setNumCapitulos] = useState(10);
    const [busqueda, setBusqueda] = useState('');
    const [dialogoAbierto, setDialogoAbierto] = useState(false);
    const [eventoEditando, setEventoEditando] = useState(null);
    const [nuevoEvento, setNuevoEvento] = useState({
        titulo: '',
        capitulo: 1,
        importancia: 5,
        descripcion: ''
    });

    const { idLibro } = useParams();
    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    const cargarEventos = async () => {
        if (!uid || !idLibro) return;
        const ref = collection(db, 'users', uid, 'projects', idLibro, 'events');
        const q = query(ref, orderBy('orden', 'asc'));
        const snapshot = await getDocs(q);
        const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEventos(datos);
    };

    useEffect(() => {
        cargarEventos();
    }, [uid, idLibro]);

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(eventos);
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);

        setEventos(items);

        const batch = writeBatch(db);
        items.forEach((evento, index) => {
            const ref = doc(db, 'users', uid, 'projects', idLibro, 'events', evento.id);
            batch.update(ref, { orden: index });
        });
        await batch.commit();
    };

    const abrirDialogo = (evento = null) => {
        if (evento) {
            setEventoEditando(evento);
            setNuevoEvento(evento);
        } else {
            setEventoEditando(null);
            setNuevoEvento({
                titulo: '',
                capitulo: 1,
                importancia: 5,
                descripcion: ''
            });
        }
        setDialogoAbierto(true);
    };

    const cerrarDialogo = () => {
        setDialogoAbierto(false);
        setEventoEditando(null);
        setNuevoEvento({
            titulo: '',
            capitulo: 1,
            importancia: 5,
            descripcion: ''
        });
    };

    const guardarEvento = async () => {
        if (eventoEditando) {
            const ref = doc(db, 'users', uid, 'projects', idLibro, 'events', eventoEditando.id);
            await updateDoc(ref, nuevoEvento);
            setEventos(eventos.map(e => e.id === eventoEditando.id ? { ...e, ...nuevoEvento } : e));
        } else {
            const ref = collection(db, 'users', uid, 'projects', idLibro, 'events');
            const docRef = await addDoc(ref, { ...nuevoEvento, orden: eventos.length });
            setEventos([...eventos, { id: docRef.id, ...nuevoEvento }]);
        }
        cerrarDialogo();
    };

    const eliminarEvento = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
        
        const ref = doc(db, 'users', uid, 'projects', idLibro, 'events', id);
        await deleteDoc(ref);
        setEventos(eventos.filter(e => e.id !== id));
    };

    const eventosFiltrados = eventos.filter(e => 
        e.titulo.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Box p={3}>
            <Box mb={4} display="flex" gap={2} alignItems="center">
                <TextField
                    label="Número de capítulos"
                    type="number"
                    value={numCapitulos}
                    onChange={(e) => setNumCapitulos(Math.max(1, parseInt(e.target.value)))}
                    sx={{ width: 150 }}
                />
                <TextField
                    fullWidth
                    label="Buscar eventos"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button variant="contained" onClick={() => abrirDialogo()}>
                    Añadir Evento
                </Button>
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="eventos">
                    {(provided) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                            {eventosFiltrados.map((evento, index) => (
                                <Draggable key={evento.id} draggableId={evento.id} index={index}>
                                    {(provided) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{ mb: 2 }}
                                        >
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="h6">{evento.titulo}</Typography>
                                                    <Box>
                                                        <IconButton onClick={() => abrirDialogo(evento)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => eliminarEvento(evento.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Typography color="textSecondary">
                                                    Capítulo {evento.capitulo}
                                                </Typography>
                                                <Rating
                                                    value={evento.importancia}
                                                    readOnly
                                                    max={10}
                                                />
                                                <Typography variant="body2">
                                                    {evento.descripcion}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            <Dialog open={dialogoAbierto} onClose={cerrarDialogo} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {eventoEditando ? 'Editar Evento' : 'Nuevo Evento'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Título"
                        value={nuevoEvento.titulo}
                        onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Capítulo"
                        type="number"
                        value={nuevoEvento.capitulo}
                        onChange={(e) => setNuevoEvento({ ...nuevoEvento, capitulo: Math.min(Math.max(1, parseInt(e.target.value)), numCapitulos) })}
                        margin="normal"
                        inputProps={{ min: 1, max: numCapitulos }}
                    />
                    <Typography gutterBottom>
                        Importancia (1-10)
                    </Typography>
                    <Slider
                        value={nuevoEvento.importancia}
                        onChange={(e, newValue) => setNuevoEvento({ ...nuevoEvento, importancia: newValue })}
                        min={1}
                        max={10}
                        marks
                        valueLabelDisplay="auto"
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        value={nuevoEvento.descripcion}
                        onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={cerrarDialogo}>Cancelar</Button>
                    <Button onClick={guardarEvento} variant="contained">
                        {eventoEditando ? 'Guardar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LineaTemporalPage;