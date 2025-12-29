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
    path: 'information',
    loadComponent: () => import('./features/information/information').then(m => m.InformationComponent)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'resolution',
    loadComponent: () => import('./features/resolution/resolution.component').then(m => m.ResolutionComponent)
  }
];
