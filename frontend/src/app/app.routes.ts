import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'audit',
    loadComponent: () => import('./features/audit/audit.component').then(m => m.AuditComponent)
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