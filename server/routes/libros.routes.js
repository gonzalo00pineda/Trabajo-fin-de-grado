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
