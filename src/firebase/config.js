// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2RmIRsRPTMWy_bylHMAXinxtAhF6Bhko",
    authDomain: "tfg-planificador-novelas.firebaseapp.com",
    projectId: "tfg-planificador-novelas",
    storageBucket: "tfg-planificador-novelas.firebasestorage.app",
    messagingSenderId: "886729025688",
    appId: "1:886729025688:web:529b2a23cfe8eead4bc8ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportamos para poder usarla en otros archivos
export default app;