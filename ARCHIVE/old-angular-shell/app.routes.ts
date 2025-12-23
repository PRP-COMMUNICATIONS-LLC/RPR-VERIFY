// app.routes.ts
// Location: src/app/app.routes.ts
// Angular v17+ Routes Configuration for RPR-VERIFY-V1

import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { SecureUploadComponent } from './features/secure-upload/secure-upload.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { PendingVerificationComponent } from './features/pending-verification/pending-verification.component';
import { DisputeResolutionComponent } from './features/disputes/dispute-resolution.component';

/**
 * Application Routes
 * Defines all navigable paths in the RPR-VERIFY application
 * MainLayoutComponent serves as the shell wrapper for all routes
 */
export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'upload',
        pathMatch: 'full'
      },
      {
        path: 'upload',
        component: SecureUploadComponent,
        data: { title: 'Secure Document Upload' }
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        data: { title: 'Transaction Ledger' }
      },
      {
        path: 'verification',
        component: PendingVerificationComponent,
        data: { title: 'Customer Verification' }
      },
      {
        path: 'resolution',
        component: DisputeResolutionComponent,
        data: { title: 'Case Resolution & Dispute Management' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'upload'
  }
];
