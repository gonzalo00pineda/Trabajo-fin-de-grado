/**
 * Configuración de Firebase Admin SDK
 * Este archivo inicializa la conexión con Firebase para el servidor,
 * proporcionando acceso a Firestore (base de datos) y Authentication (autenticación).
 * Utiliza las credenciales de servicio almacenadas en serviceAccountKey.json
 * para autenticar las operaciones del servidor con Firebase.
 */

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';



// Exportar las instancias de Firestore y Auth para su uso en la aplicación
export const db = getFirestore();
export const adminAuth = getAuth();
