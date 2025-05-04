
// En este archivo se definen las funciones para interactuar con Firestore
// Importar las funciones necesarias de Firebase
// Importar la configuración de Firebase
// y la inicialización de la aplicación



import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getUserBooks = async (uid) => {
    const librosRef = collection(db, 'users', uid, 'projects');
    const snapshot = await getDocs(librosRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

