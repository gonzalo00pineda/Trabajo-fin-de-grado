// Componente que representa el formulario para crear un nuevo libro
// Permite ingresar título, descripción y subir una imagen de portada


import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { subirImagenPortada, guardarLibro } from '../services/firestore';

const NuevoLibroForm = ({ uid, onLibroCreado }) => {
    // Estados para manejar los campos del formulario y el estado de carga
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [portada, setPortada] = useState(null);
    const [subiendo, setSubiendo] = useState(false);

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubiendo(true);

        try {
            // Sube la imagen de portada si se seleccionó una
            let urlPortada = '';
            if (portada) {
                urlPortada = await subirImagenPortada(uid, portada);
            }

            // Guarda los datos del libro en Firestore
            await guardarLibro(uid, {
                title: titulo,
                description: descripcion,
                cover: urlPortada,
            });

            // Reinicia el formulario
            setTitulo('');
            setDescripcion('');
            setPortada(null);
            onLibroCreado(); // Notifica que el libro fue creado exitosamente

        } catch (err) {
            console.error(err);

        } finally {
            setSubiendo(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {/* Campo para el título del libro */}
            <TextField
                fullWidth
                label="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                margin="normal"
                required
            />

            {/* Campo para la descripción del libro */}
            <TextField
                fullWidth
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                margin="normal"
                multiline
                rows={3}
            />

            {/* Input para seleccionar la imagen de portada */}
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setPortada(e.target.files[0])}
                style={{ margin: "1rem 0" }}
            />

            {/* Botón para enviar el formulario */}
            <Button 
                type="submit" 
                variant="contained" 
                disabled={subiendo}
                fullWidth
                sx={{ mt: 2 }}
            >
                {subiendo ? 'Creando...' : 'Crear Libro'}
            </Button>
        </Box>
    );
};

export default NuevoLibroForm;
