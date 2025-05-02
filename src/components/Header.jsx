
// Este archivo define un componente funcional de React llamado Header.
// Este componente representa el encabezado de la aplicación y contiene un título.

import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
    return (
        <AppBar position="static" color="primary" elevation={3}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Planificador de Novelas
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;  // El componente se exporta lo que permite importarlo y usarlo en otros archivos.

/*

- AppBar: barra superior fija (por defecto color primario).

- Toolbar: da altura y padding automáticamente.

- Typography: muestra el título con estilo.

- sx={{ flexGrow: 1 }}: empuja el contenido hacia los lados (útil si luego agregas botones, usuario, etc.).


*/
