/**
 * Configuración de Firebase Admin SDK
 * Este archivo inicializa la conexión con Firebase para el servidor,
 * proporcionando acceso a Firestore (base de datos) y Authentication (autenticación).
 * Utiliza las credenciales de servicio almacenadas en serviceAccountKey.json
 * para autenticar las operaciones del servidor con Firebase.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

// Crear require para importar JSON en módulos ES
const require = createRequire(import.meta.url);

// Importar las credenciales de servicio de Firebase
const serviceAccount = require('./serviceAccountKey.json');

// Inicializar la aplicación de Firebase Admin con las credenciales
initializeApp({
    credential: cert(serviceAccount)
});

// Exportar las instancias de Firestore y Auth para su uso en la aplicación
export const db = getFirestore();
export const adminAuth = getAuth();
