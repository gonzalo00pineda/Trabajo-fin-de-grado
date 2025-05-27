/**
 * Configuración de rutas para la gestión de libros
 * Este archivo define todos los endpoints relacionados con las operaciones CRUD de libros.
 * Utiliza el Router de Express para manejar las diferentes rutas HTTP y conectarlas
 * con sus respectivos controladores.
 */

import { Router } from 'express';
import {
    obtenerLibros,
    crearLibro,
    obtenerLibroPorId,
    eliminarLibro,
    actualizarLibro
} from '../controllers/libros.controller.js';

const router = Router();

router.get('/', obtenerLibros);
router.post('/', crearLibro);
router.get('/:id', obtenerLibroPorId);
router.delete('/:id', eliminarLibro);
router.put('/:id', actualizarLibro);

export default router;
