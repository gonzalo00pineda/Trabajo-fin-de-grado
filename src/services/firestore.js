
// En este archivo se definen las funciones para interactuar con Firestore
// Importar las funciones necesarias de Firebase
// Importar la configuración de Firebase
// y la inicialización de la aplicación



import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config'; // ahora necesitaremos storage también

// crea un nuevo personaje en Firestore
// y lo asocia al libro correspondiente
export const crearPersonaje = async (uid, projectId, personaje) => {
    const refPersonajes = collection(db, 'users', uid, 'projects', projectId, 'characters');
    const docRef = await addDoc(refPersonajes, personaje);
    return { ...personaje, id: docRef.id };
};

// obtiene la lista de personajes de un libro desde Firestore
export const cargarPersonajes = async (uid, projectId) => {
    const ref = collection(db, 'users', uid, 'projects', projectId, 'characters');
    const snap = await getDocs(ref);

    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// obtiene la lista de libros del usuario desde Firestore
export const getUserBooks = async (uid) => {
    const librosRef = collection(db, 'users', uid, 'projects');
    const snapshot = await getDocs(librosRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// guarda un nuevo libro en Firestore
export const guardarLibro = async (uid, data ) => {
    const librosRef = collection(db, 'users', uid, 'projects');
    await addDoc(librosRef, data);
};

// guarda una nueva imagen de portada en Firebase Storage
// y devuelve la URL de descarga
export const subirImagenPortada = async (uid, archivo) => {
    const nombreArchivo = `${Date.now()}-${archivo.name}`;
    const ruta = `gs://tfg-planificador-novelas.firebasestorage.app/${nombreArchivo}`;
    const storageRef = ref(storage, ruta);
    await uploadBytes(storageRef, archivo);
    const url = await getDownloadURL(storageRef);
    
    return url;
};


// obtiene la lista de capítulos de un libro desde Firestore
export const getChapters = async (uid, libroId) => {
    const ref = collection(db, 'users', uid, 'projects', libroId, 'chapters');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// guarda un nuevo capítulo en Firestore
// y lo asocia al libro correspondiente
export const guardarCapitulo = async (uid, libroId, data) => {
    const ref = collection(db, 'users', uid, 'projects', libroId, 'chapters');
    await addDoc(ref, data);
};


