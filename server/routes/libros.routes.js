import { Router } from 'express';
import {
    obtenerLibros,
    crearLibro,
    obtenerLibroPorId,
    eliminarLibro

} from '../controllers/libros.controller.js';

const router = Router();

router.get('/', obtenerLibros);
router.post('/', crearLibro);
router.get('/:id', obtenerLibroPorId);
router.delete('/:id', eliminarLibro);

export default router;
