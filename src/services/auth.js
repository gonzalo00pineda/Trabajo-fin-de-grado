/**
 * Servicio de Autenticación
 * 
 * Este módulo proporciona funciones para gestionar la autenticación de usuarios
 * utilizando Firebase Authentication. Incluye las operaciones básicas de:
 * - Registro de nuevos usuarios
 * - Inicio de sesión
 * - Cierre de sesión
 * 
 * Todas las funciones manejan la autenticación basada en email/contraseña
 */

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export const registrarUsuario = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
};

export const iniciarSesion = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
};

export const cerrarSesion = () => signOut(auth);
