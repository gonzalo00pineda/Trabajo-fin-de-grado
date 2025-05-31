//este archivo es el layout de libro, que se utiliza para mostrar la vista de un libro en particular
// y su contenido. Este layout incluye un encabezado y una barra de navegación específica para el libro.

import Header from '../components/Header';
import NavBarLibro from '../components/NavBarLibro';
import { Outlet, useParams } from 'react-router-dom';

const LayoutLibro = () => {
    const { idLibro } = useParams();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            {idLibro && <NavBarLibro idLibro={idLibro} />}
            <main style={{ flex: 1, padding: '1rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default LayoutLibro;
