import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Tu configuración (está perfecta)
const firebaseConfig = {
  apiKey: "AIzaSyCzaT4ySxwJ673ITuY9t-p9PVYPtdR0vKU",
  authDomain: "portafolio-40c15.firebaseapp.com",
  projectId: "portafolio-40c15",
  storageBucket: "portafolio-40c15.firebasestorage.app",
  messagingSenderId: "955578543700",
  appId: "1:955578543700:web:29f2292688421af320c7c1"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    
    // CORRECCIÓN 1: Usamos la variable 'firebaseConfig' para que se vea limpio
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    // CORRECCIÓN 2: ¡Faltaban estas dos líneas! Sin esto, no hay Login ni Base de datos.
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()) 
  ]
};