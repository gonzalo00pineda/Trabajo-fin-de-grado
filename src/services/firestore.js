/**
 * Servicio de Operaciones con Firestore
 * 
 * Este módulo centraliza todas las operaciones de base de datos de la aplicación,
 * gestionando la interacción con Firebase Firestore y Storage. Proporciona funciones para:
 * - Gestión de libros (crear, leer, actualizar)
 * - Gestión de personajes (crear, ordenar, listar)
 * - Gestión de capítulos
 * - Manejo de archivos (subida de imágenes de portada)
 * 
 * La estructura de datos sigue una jerarquía:
 * users/{uid}/projects/{projectId}/[characters|chapters]
 */

import { collection, addDoc, deleteDoc, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config'; // ahora necesitaremos storage también
import { doc, getDoc } from 'firebase/firestore';

// crea un nuevo personaje en Firestore
// y lo asocia al libro correspondiente
export const crearPersonaje = async (uid, projectId, personaje) => {
    const refPersonajes = collection(db, 'users', uid, 'projects', projectId, 'characters');
    // Obtener el número total de personajes para asignar el orden
    const snap = await getDocs(refPersonajes);
    const orden = snap.size;
    const docRef = await addDoc(refPersonajes, { ...personaje, orden });
    return { ...personaje, id: docRef.id, orden };
};

// obtiene la lista de personajes de un libro desde Firestore
export const cargarPersonajes = async (uid, projectId) => {
    const ref = collection(db, 'users', uid, 'projects', projectId, 'characters');
    const q = query(ref, orderBy('orden', 'asc'));
    const snap = await getDocs(q);

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

export const obtenerLibroPorId = async (uid, idLibro) => {
    const ref = doc(db, 'users', uid, 'projects', idLibro);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
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

// actualiza un libro existente en Firestore
export const updateBook = async (uid, bookId, data) => {
    const bookRef = doc(db, 'users', uid, 'projects', bookId);
    await updateDoc(bookRef, data);
};

// Elimina un libro de Firestore
export const eliminarLibro = async (uid, idLibro) => {
    const libroRef = doc(db, 'users', uid, 'projects', idLibro);
    await deleteDoc(libroRef);
};

// Edita un libro (título y/o descripción)
export const editarLibro = async (uid, idLibro, datos) => {
    const libroRef = doc(db, 'users', uid, 'projects', idLibro);
    await updateDoc(libroRef, datos);
};

