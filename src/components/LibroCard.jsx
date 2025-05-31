// Componente que representa la tarjeta de un libro en la lista
// Muestra la portada, título, descripción y opciones para eliminar o editar

import { Card, CardContent, CardMedia, Typography, IconButton, Box, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import defaultCover from '../assets/LogoApp.png';
import { useState } from 'react';

const LibroCard = ({ libro, onClick, onEliminar, onEditar }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(libro.title);
    const [editedDescription, setEditedDescription] = useState(libro.description);
    
    // Imagen por defecto si el libro no tiene portada
    const portada = libro.cover || defaultCover;

    const handleSave = () => {
        onEditar(libro.id, {
            title: editedTitle,
            description: editedDescription
        });
        setIsEditing(false);
    };

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
            {/* Botones de acción en la esquina superior derecha */}
            <Box sx={{ 
                position: 'absolute',
                right: 8,
                top: 8,
                display: 'flex',
                gap: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
                padding: '2px'
            }}>
                {isEditing ? (
                    <IconButton 
                        onClick={handleSave}
                        size="small"
                    >
                        <SaveIcon />
                    </IconButton>
                ) : (
                    <IconButton 
                        onClick={() => setIsEditing(true)}
                        size="small"
                    >
                        <EditIcon />
                    </IconButton>
                )}
                <IconButton 
                    onClick={(e) => {
                        e.stopPropagation();
                        onEliminar();
                    }}
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            </Box>

            {/* Imagen de portada del libro */}
            <CardMedia
                component="img"
                height="200"
                image={portada}
                alt={`Portada de ${libro.title}`}
                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => !isEditing && onClick(libro.id)}
            />

            {/* Contenido de la tarjeta (título y descripción) */}
            <CardContent 
                sx={{ 
                    flexGrow: 1,
                    cursor: isEditing ? 'default' : 'pointer',
                    '&:hover': { backgroundColor: isEditing ? 'inherit' : 'action.hover' }
                }}
                onClick={() => !isEditing && onClick(libro.id)}
            >
                {isEditing ? (
                    <>
                        <TextField
                            fullWidth
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            size="small"
                            label="Título"
                            margin="dense"
                        />
                        <TextField
                            fullWidth
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            size="small"
                            label="Descripción"
                            multiline
                            rows={3}
                            margin="dense"
                        />
                    </>
                ) : (
                    <>
                        <Typography gutterBottom variant="h6" component="div" noWrap>
                            {libro.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {libro.description}
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default LibroCard;

