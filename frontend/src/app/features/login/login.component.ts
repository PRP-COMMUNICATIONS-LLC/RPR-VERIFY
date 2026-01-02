import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <button (click)="login()">Sign in with Google</button>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);

  login() {
    this.authService.loginWithGoogle();
  }
}
