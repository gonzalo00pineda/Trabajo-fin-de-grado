/**
 * Controlador para la gestión de libros en la aplicación
 * Este archivo contiene todas las funciones necesarias para manejar las operaciones CRUD
 * (Crear, Leer, Actualizar, Eliminar) de los libros de cada usuario.
 * Cada operación requiere autenticación mediante token JWT y utiliza Firebase para el almacenamiento.
 */

import { db, adminAuth } from '../firebase.js';

/**
 * Obtiene todos los libros del usuario autenticado
 * @param {Request} req - Objeto de solicitud HTTP con el token de autorización
 * @param {Response} res - Objeto de respuesta HTTP
 */
export const obtenerLibros = async (req, res) => {
    // Verificar si existe el encabezado de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar el token y obtener el ID del usuario
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;
    
        // Obtener todos los proyectos (libros) del usuario desde Firestore
        const snapshot = await db.collection('users')
            .doc(uid)
            .collection('projects')
            .get();

        // Mapear los documentos a un formato más amigable
        const libros = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(libros);
    } catch (error) {
        console.error('Error al verificar token o acceder a Firestore:', error);
        res.status(403).json({ error: 'No autorizado' });
    }
};

/**
 * Crea un nuevo libro para el usuario autenticado
 * @param {Request} req - Objeto de solicitud HTTP con el token y datos del libro
 * @param {Response} res - Objeto de respuesta HTTP
 */
export const crearLibro = async (req, res) => {
    // Verificar autenticación
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar token y obtener ID del usuario
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;

        // Extraer datos del libro del cuerpo de la petición
        const { title, description, cover = null } = req.body;
    
        // Validar campos requeridos
        if (!title || !description) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        // Crear nuevo documento en Firestore
        const ref = await db.collection('users')
            .doc(uid)
            .collection('projects')
            .add({ title, description, cover });

        res.status(201).json({
            id: ref.id,
            title,
            description,
            cover
        });
    } catch (error) {
        console.error('Error al crear libro:', error);
        res.status(500).json({ error: 'Error al crear libro' });
    }
};

/**
 * Obtiene un libro específico por su ID
 * @param {Request} req - Objeto de solicitud HTTP con el ID del libro
 * @param {Response} res - Objeto de respuesta HTTP
 */
export const obtenerLibroPorId = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Aquí se devolvería el libro con ID ${id}` });
};

/**
 * Elimina un libro específico del usuario autenticado
 * @param {Request} req - Objeto de solicitud HTTP con el token y el ID del libro
 * @param {Response} res - Objeto de respuesta HTTP
 */
export const eliminarLibro = async (req, res) => {
    // Verificar autenticación
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar token y obtener ID del usuario
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;
        const { id } = req.params;
    
        // Eliminar el documento de Firestore
        const ref = db.collection('users').doc(uid).collection('projects').doc(id);
        await ref.delete();
    
        res.json({ message: `Libro ${id} eliminado correctamente.` });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
};

/**
 * Actualiza los datos de un libro específico
 * @param {Request} req - Objeto de solicitud HTTP con el token, ID del libro y datos a actualizar
 * @param {Response} res - Objeto de respuesta HTTP
 */
export const actualizarLibro = async (req, res) => {
    // Verificar autenticación
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar token y obtener ID del usuario
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;
        const { id } = req.params;
        const { title, description } = req.body;

        // Validar que haya al menos un campo para actualizar
        if (!title && !description) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }

        // Preparar y realizar la actualización en Firestore
        const ref = db.collection('users').doc(uid).collection('projects').doc(id);
        const updateData = {};
        
        if (title) updateData.title = title;
        if (description) updateData.description = description;

        await ref.update(updateData);
        
        res.json({ 
            message: `Libro ${id} actualizado correctamente`,
            data: updateData
        });
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        res.status(500).json({ error: 'Error al actualizar libro' });
    }
};



