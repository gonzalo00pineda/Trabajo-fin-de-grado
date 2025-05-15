// Este archivo define el componente de tarjeta para mostrar información de un libro.

import { Card, CardContent, Typography, CardActionArea, CardMedia, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const LibroCard = ({ libro, onClick, onEliminar }) => {
    return (
        <Card sx={{ maxWidth: 300, position: 'relative' }}>
            <CardActionArea onClick={() => onClick(libro.id)}>
                {libro.cover && (
                    <CardMedia
                        component="img"
                        height="180"
                        image={libro.cover}
                        alt={`Portada de ${libro.title}`}
                    />
                )}
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {libro.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {libro.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <IconButton
                onClick={() => onEliminar(libro.id)}
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8, color: 'grey' }}
            >
                <DeleteIcon />
            </IconButton>
        </Card>
    );
};

export default LibroCard;

