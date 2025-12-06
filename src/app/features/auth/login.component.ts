import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

            <button class="login-button google-signin-button" (click)="signIn()">
                <span class="icon">G</span>
                Sign in with Google Workspace
            </button>
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
        gap: 12px;
        margin-bottom: 32px;
    }
    .login-logo-mark {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
    }
    .login-logo-text {
        display: flex;
        gap: 6px;
        align-items: baseline;
    }
    .login-logo-rpr {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.16em;
        color: #FFFFFF;
    }
    .login-logo-verify {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.16em;
        color: #00D9CC;
        text-shadow: 0 0 18px rgba(0, 217, 204, 0.6);
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
    .login-button,
    .google-signin-button {
        width: 100%;
        margin-top: 16px;
        margin-bottom: 24px;
        padding: 12px 16px;
        border-radius: 8px;
        border: none;
        background: var(--accent-primary);
        color: #000000;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.2s;
    }
    .login-button:hover,
    .google-signin-button:hover {
        background: var(--accent-hover);
    }
    .icon {
        font-weight: bold;
        font-family: serif;
    }
    .login-footer {
        font-size: 11px;
        color: var(--text-secondary);
    }
  `]
})
export class LoginComponent {
    // AG-LESSON: Entry point for RPR COMMUNICATIONS LLC Google Workspace login.

    signIn(): void {
        // AG-LESSON: Stub for Google Workspace SSO / OAuth2 integration.
        console.log('Login clicked - Stub');
        if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
        }
    }
}
