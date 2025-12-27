import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'verification',
    loadComponent: () => import('./features/verification/verification.component').then(m => m.VerificationComponent)
  },
  {
    path: 'resolution',
    loadComponent: () => import('./features/resolution/resolution.component').then(m => m.ResolutionComponent)
  }
];
