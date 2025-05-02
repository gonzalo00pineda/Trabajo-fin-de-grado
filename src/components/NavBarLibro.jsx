
// src/components/NavBarLibro.jsx
// Este componente es una barra de navegación simple para un libro.
// Utiliza React Router para la navegación entre diferentes secciones de la aplicación.


import { Tabs, Tab, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
    { label: 'Capítulos', path: '/capitulos' },
    { label: 'Personajes', path: '/personajes' },
    { label: 'Línea Temporal', path: '/linea-temporal' },
    { label: 'Sistema de Magia', path: '/magia' },
];

const NavBarLibro = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: 'background.paper' }}>
            <Tabs
                value={location.pathname}
                onChange={(e, newValue) => navigate(newValue)}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                {navItems.map(({ label, path }) => (
                <Tab key={path} label={label} value={path} />
                ))}
            </Tabs>
        </Box>
    );
};

export default NavBarLibro;

