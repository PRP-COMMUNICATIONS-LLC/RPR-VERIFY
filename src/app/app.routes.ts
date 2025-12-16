import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login.component';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    // AG-LESSON: Root route redirected to /login so users authenticate before using dashboard.

    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },
    {
        path: 'dashboard/escalation',
        loadComponent: () => import('./components/escalation-dashboard/escalation-dashboard.component').then(m => m.EscalationDashboardComponent)
    },
    {
        path: 'case-detail',
        loadComponent: () => import('./features/cases/case-detail.component').then(m => m.CaseDetailComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },
    {
        path: 'upload',
        loadComponent: () => import('./features/upload/upload.component').then(m => m.UploadComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },

    // AG-LESSON: New Case route added to match sidebar tabs.
    {
        path: 'cases/new',
        loadComponent: () => import('./features/cases/new-case.component').then(m => m.NewCaseComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },

    {
        path: 'disputes',
        loadComponent: () => import('./features/disputes/dispute-detail.component').then(m => m.DisputeDetailComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },
    {
        path: 'disputes/:id',
        loadComponent: () => import('./features/disputes/dispute-detail.component').then(m => m.DisputeDetailComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },
    {
        path: 'reports',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    }, // Stub: Reuse dashboard or create placeholder if needed

    {
        path: 'cases',
        loadComponent: () => import('./features/cases/cases-list.component').then(m => m.CasesListComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },
    {
        path: 'cases/:id',
        loadComponent: () => import('./features/cases/case-detail.component').then(m => m.CaseDetailComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },
    {
        path: 'cases/:id/cis-report',
        loadComponent: () => import('./features/reports/cis-report-viewer.component').then(m => m.CisReportViewerComponent)
        // canActivate: [authGuard]  // Temporarily disabled for testing
    },
    { path: 'settings', redirectTo: 'dashboard' },
    { path: 'help', redirectTo: 'dashboard' }
];
