import { db, adminAuth } from '../firebase.js';


export const obtenerLibros = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;
    
        const snapshot = await db.collection('users')
            .doc(uid)
            .collection('projects')
            .get();

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

export const crearLibro = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;

        const { title, description, cover = null } = req.body;
    
        if (!title || !description) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

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

export const obtenerLibroPorId = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Aquí se devolvería el libro con ID ${id}` });
};


export const eliminarLibro = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;
        const { id } = req.params;
    
        const ref = db.collection('users').doc(uid).collection('projects').doc(id);
        await ref.delete();
    
        res.json({ message: `Libro ${id} eliminado correctamente.` });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        res.status(500).json({ error: 'Error al eliminar libro' });
    }
};

export const actualizarLibro = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title && !description) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }

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



