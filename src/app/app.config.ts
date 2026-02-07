import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

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
    
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideHttpClient(
      withInterceptors([jwtInterceptor]))
  ]
};