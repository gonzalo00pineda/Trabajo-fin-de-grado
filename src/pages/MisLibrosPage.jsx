
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Container, Typography } from '@mui/material';
import LibroCard from '../components/LibroCard';
import { getUserBooks } from '../services/firestore'; 

const MisLibrosPage = () => {
    const [libros, setLibros] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUserBooks('UID_EJEMPLO') // 🔁 REEMPLAZAR con el UID real más adelante
        .then(setLibros)
        .catch(console.error);
    }, []);

    const handleSeleccionarLibro = (idLibro) => {
        navigate(`/libros/${idLibro}/capitulos`);
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Mis Libros
            </Typography>
            <Grid container spacing={2}>
                {libros.map((libro) => (
                    <Grid key={libro.id}>
                        <LibroCard libro={libro} onClick={handleSeleccionarLibro} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default MisLibrosPage;
