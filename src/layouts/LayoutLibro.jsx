import Header from '../components/Header';
import NavBarLibro from '../components/NavBarLibro';
import { Outlet } from 'react-router-dom';

const LayoutLibro = () => {
    return (
    <>

        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <NavBarLibro />
            <main style={{ flex: 1, padding: '1rem' }}>
                <Outlet />
            </main>
        </div>

    </>
    );
};

export default LayoutLibro;
