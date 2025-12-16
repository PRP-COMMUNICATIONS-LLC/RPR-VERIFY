import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login.component';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard/escalation',
        loadComponent: () => import('./components/escalation-dashboard/escalation-dashboard.component').then(m => m.EscalationDashboardComponent),
        title: 'RPR Verify | Escalation Dashboard',
        canActivate: [authGuard]
    },
    {
        path: 'case-detail',
        loadComponent: () => import('./features/cases/case-detail.component').then(m => m.CaseDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'upload',
        loadComponent: () => import('./features/upload/upload.component').then(m => m.UploadComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cases/new',
        loadComponent: () => import('./features/cases/new-case.component').then(m => m.NewCaseComponent),
        canActivate: [authGuard]
    },
    {
        path: 'disputes',
        loadComponent: () => import('./features/disputes/dispute-detail.component').then(m => m.DisputeDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'disputes/:id',
        loadComponent: () => import('./features/disputes/dispute-detail.component').then(m => m.DisputeDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'reports',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cases',
        loadComponent: () => import('./features/cases/cases-list.component').then(m => m.CasesListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cases/:id',
        loadComponent: () => import('./features/cases/case-detail.component').then(m => m.CaseDetailComponent),
        canActivate: [authGuard]
    },
    {
        path: 'cases/:id/cis-report',
        loadComponent: () => import('./features/reports/cis-report-viewer.component').then(m => m.CisReportViewerComponent),
        canActivate: [authGuard]
    },
    { path: 'settings', redirectTo: 'dashboard', canActivate: [authGuard] },
    { path: 'help', redirectTo: 'dashboard', canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' } // Wildcard for 404 handling
];
