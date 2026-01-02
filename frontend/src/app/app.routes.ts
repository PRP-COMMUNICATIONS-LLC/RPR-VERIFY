import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { VerificationComponent } from './features/verification/verification.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'verification',
    component: VerificationComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/verification', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
