import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getApps, getApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SecurityContextInterceptor } from './core/interceptors/security-context.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // EMERGENCY FIX: Enable Zoneless change detection to prevent Zone.js conflicts
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityContextInterceptor,
      multi: true
    },
    // Singleton pattern: Check if Firebase app already exists before initializing
    // This prevents duplicate app errors during HMR and ensures stable connections
    provideFirebaseApp(() => {
      const apps = getApps();
      return apps.length === 0 
        ? initializeApp(environment.firebase) 
        : getApp();
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
