
// En este archivo se definen las funciones para interactuar con Firestore
// Importar las funciones necesarias de Firebase
// Importar la configuración de Firebase
// y la inicialización de la aplicación



import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config'; // ahora necesitaremos storage también


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





