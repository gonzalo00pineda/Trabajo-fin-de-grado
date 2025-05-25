// Componente que representa la tarjeta de un libro en la lista
// Muestra la portada, título, descripción y opciones para eliminar o editar

import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import defaultCover from '../assets/logoNovplax.png';

const LibroCard = ({ libro, onClick, onEliminar }) => {
    // Imagen por defecto si el libro no tiene portada
    const portada = libro.cover || defaultCover;

    return (
        <Card 
            sx={{ 
                width: 250,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                m: 2
            }}
        >
            {/* Botón de eliminar en la esquina superior derecha */}
            <IconButton 
                onClick={(e) => {
                    e.stopPropagation(); // Evita que el clic se propague a la tarjeta
                    onEliminar();
                }}
                sx={{ 
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }
                }}
            >
                <DeleteIcon />
            </IconButton>

            {/* Imagen de portada del libro */}
            <CardMedia
                component="img"
                height="200"
                image={portada}
                alt={`Portada de ${libro.title}`}
                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => onClick(libro.id)}
            />

            {/* Contenido de la tarjeta (título y descripción) */}
            <CardContent 
                sx={{ 
                    flexGrow: 1,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' }
                }}
                onClick={() => onClick(libro.id)}
            >
                <Typography gutterBottom variant="h6" component="div" noWrap>
                    {libro.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {libro.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LibroCard;

