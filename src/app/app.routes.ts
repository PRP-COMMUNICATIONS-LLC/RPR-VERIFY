import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';

export const routes: Routes = [
  // 1. Public Routes (Outside the Shell)
  {
    path: 'login',
    component: LoginComponent,
    title: 'RPR Verify | Login'
  },

  // 2. Protected Routes (Inside the Sovereign Shell)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'upload', 
        pathMatch: 'full' 
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'RPR Verify | Command'
      },
      {
        path: 'upload',
        loadComponent: () => import('./features/secure-upload/secure-upload.component').then(m => m.SecureUploadComponent),
        title: 'RPR Verify | Secure Ingestion'
      },
      // Placeholder for future features
      {
        path: 'cases',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'RPR Verify | Case Files'
      }
    ]
  },

  // 3. Fallback
  { path: '**', redirectTo: 'upload' }
];
