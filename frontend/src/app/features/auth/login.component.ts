import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="login-container">
        <div class="login-card">
            <div class="login-branding">
                <svg class="login-logo-mark" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <style>.st2{fill:#FFFFFF;}</style>
                  <g id="_x32__white">
                    <path class="st2" d="M366.26,256L256,56L145.74,256L35.48,456H256h220.52L366.26,256z M462.43,448.02H327.14
                      c-52.29-17.46-99.26-47.08-123.05-72.78c12.09,3.24,29.59,6.3,53.32,6.78c43.69,0.87,71.69-14.09,71.69-14.09s-0.04-0.49-0.13-1.36
                      l0.44,1.33c10.53-38.31,14.66-76.67,9.8-143.39l20.22,36.67L462.43,448.02z M255.21,246.4c0,0,17.34,12.57,41.66,53.19
                      c15.5,25.89,23.07,61.65,23.07,61.65s-27.12,11.27-63.76,11.1c-37.52-0.53-63.59-9.51-63.59-9.51s5.81-34.7,21.66-61.82
                      C230.29,270.35,255.21,246.4,255.21,246.4z M153.41,261.17L256.42,74.33l70.68,128.2c8.42,51.22,5.65,107.88-2.38,140.27
                      c-3.5-14.36-9.64-32.72-20.28-49.2c-28.27-43.79-47.74-58.99-47.74-58.99s-0.36,0.2-1.01,0.63
                      c-42.74,11.66-77.73,28.09-123.62,64.64L153.41,261.17z M50.4,448.02l69.84-126.68c39.4-37.4,94.72-65.51,118.02-70.6
                      c-9.71,10.52-22.24,27.08-35.09,52.2c-18.12,35.42-20.61,64.11-20.61,64.11s0.59,0.37,1.78,0.99l-1.55-0.36
                      c29.53,30.52,56.36,49.88,116.46,80.35h-42.83H50.4z"/>
                  </g>
                </svg>

                <div class="login-logo-text">
                  <span class="login-logo-rpr">RPR</span>
                  <span class="login-logo-verify">VERIFY</span>
                </div>
            </div>

            <button 
                class="google-signin-button" 
                (click)="signInWithGoogle()" 
                type="button"
                [disabled]="isLoading"
            >
                <img 
                    src="assets/google-buttons/web_dark_rd_ctn@4x.png" 
                    alt="Continue with Google"
                    class="google-button-image"
                    [style.opacity]="isLoading ? '0.6' : '1'"
                />
            </button>
            <p *ngIf="errorMessage" class="error-message">{{ errorMessage }}</p>
            <div class="login-footer">
                Authorized RPR Communications LLC personnel only.
            </div>
        </div>
    </div>
  `,
    styles: [`
    .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-primary);
    }
    .login-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 40px 48px 32px;
        max-width: 520px;
        width: 100%;
        color: var(--text-primary);
        display: flex;
        flex-direction: column;
    }
    .login-branding {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
        margin-bottom: 56px;
    }
    .login-logo-mark {
        width: 52px;
        height: 52px;
        flex-shrink: 0;
    }
    .login-logo-text {
        display: flex;
        gap: 8px;
        align-items: baseline;
    }
    .login-logo-rpr {
        font-size: 26px;
        font-weight: 600;
        color: var(--text-primary);
        letter-spacing: 0.16em;
        line-height: 1;
    }
    .login-logo-verify {
        font-size: 26px;
        font-weight: 600;
        color: var(--accent-primary);
        letter-spacing: 0.16em;
        line-height: 1;
        text-shadow: 0 0 12px rgba(0, 217, 204, 0.4);
    }
    .google-signin-button {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: opacity 0.2s ease, transform 0.1s ease;
        margin: 32px 0;
    }
    .google-signin-button:hover {
        opacity: 0.92;
        transform: translateY(-1px);
    }
    .google-signin-button:active {
        transform: translateY(0);
    }
    .google-button-image {
        width: 320px;
        height: auto;
        display: block;
        border-radius: 8px;
    }
    @media (max-width: 480px) {
        .google-button-image {
            width: 280px;
        }
    }
    .login-input {
        width: 100%;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 10px 12px;
        color: var(--text-primary);
    }
    .login-input::placeholder {
        color: var(--text-secondary);
    }
    .icon {
        font-weight: bold;
        font-family: serif;
    }
    .login-footer {
        font-size: 11px;
        color: var(--text-secondary);
    }
    .error-message {
        color: #ef4444;
        font-size: 14px;
        margin: 16px 0;
        padding: 12px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 8px;
        text-align: center;
    }
    .google-signin-button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
  `]
})
export class LoginComponent {
    // AG-LESSON: Entry point for RPR COMMUNICATIONS LLC Google Workspace login.
    
    private authService = inject(AuthService);
    
    isLoading = false;
    errorMessage = '';

    async signInWithGoogle(): Promise<void> {
        this.isLoading = true;
        this.errorMessage = '';
        
        try {
            await this.authService.signInWithGoogle();
            // Navigation is handled by AuthService
        } catch (error: any) {
            console.error('Sign-in error:', error);
            this.errorMessage = error.message || 'Failed to sign in. Please try again.';
        } finally {
            this.isLoading = false;
        }
    }
}
