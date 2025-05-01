import Header from '../components/Header';
import NavBarLibro from '../components/NavBarLibro';
import { Outlet } from 'react-router-dom';

const LayoutLibro = () => {
    return (
    <>
        <Header />
        <NavBarLibro />
        <main style={{ padding: "1rem" }}>
        <Outlet />
        </main>
    </>
    );
};

export default LayoutLibro;
