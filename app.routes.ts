// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CasesListComponent } from './components/cases-list/cases-list.component';
import { CaseDetailComponent } from './components/case-detail/case-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cases', component: CasesListComponent },
  { path: 'cases/:id', component: CaseDetailComponent },
  { path: 'disputes', component: CasesListComponent }, // Placeholder
  { path: 'reports', component: DashboardComponent }, // Reports maps to Dashboard
  { path: 'settings', loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent) },
  { path: 'help', loadComponent: () => import('./components/help/help.component').then(m => m.HelpComponent) },
  { path: '**', redirectTo: '/dashboard' }
];
