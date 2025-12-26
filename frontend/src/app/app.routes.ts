import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // The only source for the Sovereign Header
    children: [
      {
        path: 'information',
        // Lazy loading forces a fresh chunk generation
        loadComponent: () => import('./features/information/information').then(m => m.InformationComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'verification',
        loadComponent: () => import('./features/verification/verification.component').then(m => m.VerificationComponent)
      },
      {
        path: 'resolution',
        loadComponent: () => import('./features/resolution/resolution.component').then(m => m.ResolutionComponent)
      },
      {
        path: 'disputes',
        loadComponent: () => import('./features/disputes/dispute-resolution.component').then(m => m.DisputeResolutionComponent)
      },
      {
        path: 'pending',
        loadComponent: () => import('./features/pending-verification/pending-verification.component').then(m => m.PendingVerificationComponent)
      },
      { path: '', redirectTo: 'information', pathMatch: 'full' }
    ]
  }
];