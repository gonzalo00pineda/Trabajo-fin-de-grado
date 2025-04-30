
// En este archivo se definen las funciones para interactuar con Firestore
// Importar las funciones necesarias de Firebase
// Importar la configuración de Firebase
// y la inicialización de la aplicación



import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';
import app from './config';

const db = getFirestore(app);

// Crear un capítulo para un proyecto
export async function crearCapitulo(uid, projectId, capituloData) {
    const capituloRef = doc(collection(db, 'users', uid, 'projects', projectId, 'chapters'));
    await setDoc(capituloRef, capituloData);
}

// Obtener todos los personajes de un proyecto
export async function obtenerPersonajes(uid, projectId) {
    const personajesRef = collection(db, 'users', uid, 'projects', projectId, 'characters');
    const snapshot = await getDocs(personajesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
