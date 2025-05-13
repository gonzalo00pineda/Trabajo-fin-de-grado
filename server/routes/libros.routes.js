import { Router } from 'express';
import {
    obtenerLibros,
    crearLibro,
    obtenerLibroPorId
} from '../controllers/libros.controller.js';

const router = Router();

router.get('/', obtenerLibros);
router.post('/', crearLibro);
router.get('/:id', obtenerLibroPorId);

export default router;
