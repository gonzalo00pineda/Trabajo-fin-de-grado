// Este archivo define el componente de tarjeta para mostrar información de un libro.

import { Card, CardContent, Typography, CardActionArea, CardMedia } from '@mui/material';

const LibroCard = ({ libro, onClick }) => {
    return (
        <Card sx={{ maxWidth: 300 }}>
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
        </Card>
    );
};

export default LibroCard;

