import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login.component';
import { NewCaseComponent } from './features/cases/new-case.component';
import { DisputeDetailComponent } from './features/disputes/dispute-detail.component';
import { UploadComponent } from './features/upload/upload.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    // AG-LESSON: Root route redirected to /login so users authenticate before using dashboard.

    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    {
        path: 'case-detail',
        loadComponent: () => import('./features/cases/case-detail.component').then(m => m.CaseDetailComponent),
    canActivate: [authGuard]
    },
    { path: 'upload', component: UploadComponent, canActivate: [authGuard] },

    // AG-LESSON: New Case route added to match sidebar tabs.
    { path: 'cases/new', component: NewCaseComponent, canActivate: [authGuard] },

    // AG-LESSON: Disputes route added replacing old Transactions. Reports stub added.
    { path: 'disputes', component: DisputeDetailComponent, canActivate: [authGuard] },
    { path: 'disputes/:id', component: DisputeDetailComponent, canActivate: [authGuard] },
    { path: 'reports', component: DashboardComponent, canActivate: [authGuard] }, // Stub: Reuse dashboard or create placeholder if needed

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
    { path: 'settings', redirectTo: 'dashboard' },
    { path: 'help', redirectTo: 'dashboard' }
];
