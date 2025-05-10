
// Este archivo define un formulario para crear un nuevo libro.


import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { subirImagenPortada, guardarLibro } from '../services/firestore';

const NuevoLibroForm = ({ uid, onLibroCreado }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [portada, setPortada] = useState(null);
    const [subiendo, setSubiendo] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubiendo(true);

        try {
            let urlPortada = '';
            if (portada) {
                urlPortada = await subirImagenPortada(uid, portada);
            }

            await guardarLibro(uid, {
                title: titulo,
                description: descripcion,
                cover: urlPortada,
            });

            setTitulo('');
            setDescripcion('');
            setPortada(null);
            onLibroCreado(); // Refrescar lista

        } catch (err) {
            console.error(err);

        } finally {
            setSubiendo(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Nuevo Libro</Typography>

            <TextField
                fullWidth
                label="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                margin="normal"
                multiline
                rows={3}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setPortada(e.target.files[0])}
                style={{ margin: "1rem 0" }}
            />

            <Button type="submit" variant="contained" disabled={subiendo}>
                {subiendo ? 'Subiendo...' : 'Crear Libro'}
            </Button>
        </Box>
    );
};

export default NuevoLibroForm;
