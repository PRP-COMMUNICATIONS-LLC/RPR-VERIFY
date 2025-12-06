import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login.component';
import { NewCaseComponent } from './features/cases/new-case.component';
import { DisputeDetailComponent } from './features/disputes/dispute-detail.component';
import { UploadComponent } from './features/upload/upload.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    // AG-LESSON: Root route redirected to /login so users authenticate before using dashboard.

    { path: 'dashboard', component: DashboardComponent },
    {
        path: 'case-detail',
        loadComponent: () => import('./features/cases/case-detail.component').then(m => m.CaseDetailComponent)
    },
    { path: 'upload', component: UploadComponent },

    // AG-LESSON: New Case route added to match sidebar tabs.
    { path: 'cases/new', component: NewCaseComponent },

    // AG-LESSON: Disputes route added replacing old Transactions. Reports stub added.
    { path: 'disputes', component: DisputeDetailComponent },
    { path: 'disputes/:id', component: DisputeDetailComponent },
    { path: 'reports', component: DashboardComponent }, // Stub: Reuse dashboard or create placeholder if needed

    {
        path: 'cases',
        loadComponent: () => import('./features/cases/cases-list.component').then(m => m.CasesListComponent)
    },
    {
        path: 'cases/:id',
        loadComponent: () => import('./features/cases/case-detail.component').then(m => m.CaseDetailComponent)
    },
    { path: 'settings', redirectTo: 'dashboard' },
    { path: 'help', redirectTo: 'dashboard' }
];