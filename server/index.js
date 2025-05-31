/**
 * Punto de entrada principal del servidor Express
 * Este archivo configura y arranca el servidor web, estableciendo:
 * - Middleware necesario (CORS, JSON parser)
 * - Rutas de la API
 * - Puerto de escucha
 * 
 * El servidor proporciona una API RESTful para la gestión de libros y otros recursos
 * relacionados con la aplicación de escritura creativa.
 */

import express from 'express';
import cors from 'cors';
import librosRoutes from './routes/libros.routes.js';

// Inicializar la aplicación Express
const app = express();
const PORT = 3001;

// Configurar middleware
app.use(cors());          // Habilitar CORS para permitir peticiones desde el frontend
app.use(express.json());  // Parsear automáticamente el body de las peticiones JSON

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Registrar las rutas de la API
// Todas las rutas relacionadas con libros estarán bajo /api/libros
app.use('/api/libros', librosRoutes);