
// src/components/NavBarLibro.jsx
// Este componente es una barra de navegación simple para un libro.
// Utiliza React Router para la navegación entre diferentes secciones de la aplicación.


import { NavLink } from 'react-router-dom';
//import './NavBarLibro.css'; // Opcional para estilos separados

const NavBarLibro = () => {
    return (
        <nav style={{ display: "flex", justifyContent: "center", gap: "2rem", backgroundColor: "#ddd", padding: "1rem" }}>
            <NavLink to="/capitulos">Capítulos</NavLink>
            <NavLink to="/personajes">Personajes</NavLink>
            <NavLink to="/linea-temporal">Línea Temporal</NavLink>
            <NavLink to="/magia">Sistema de Magia</NavLink>
        </nav>
    );
};

export default NavBarLibro;
