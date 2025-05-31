/**
 * Componente Raíz de la Aplicación
 * 
 * Este es el componente principal de la aplicación Novplax que actúa como punto
 * de entrada para toda la aplicación. Sus responsabilidades son:
 * - Inicializar el sistema de rutas
 * - Proporcionar el contexto global de la aplicación
 * - Renderizar el AppRouter que gestiona la navegación
 */

import AppRouter from './routes/AppRouter';

function App() {
  return <AppRouter />;
}

export default App;


