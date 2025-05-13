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

export const crearLibro = (req, res) => {
    res.json({ message: 'Aquí se crearía un nuevo libro en Firestore', data: req.body });
};

export const obtenerLibroPorId = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Aquí se devolvería el libro con ID ${id}` });
};
