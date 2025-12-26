import { Component, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IdentityService } from './core/services/identity.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: #000000;">
      <header style="display: flex; align-items: center; justify-content: space-between; padding: 25px 40px; border-bottom: 1px solid #1a1a1a;">
        
        <div style="display: flex; align-items: center; gap: 14px;">
          <svg width="45" height="45" viewBox="0 0 512 512" fill="none">
            <path d="M366.26,256L256,56L145.74,256L35.48,456H256h220.52L366.26,256z M462.43,448.02H327.14 c-52.29-17.46-99.26-47.08-123.05-72.78c12.09,3.24,29.59,6.3,53.32,6.78c43.69,0.87,71.69-14.09,71.69-14.09s-0.04-0.49-0.13-1.36 l0.44,1.33c10.53-38.31,14.66-76.67,9.8-143.39l20.22,36.67L462.43,448.02z M255.21,246.4c0,0,17.34,12.57,41.66,53.19 c15.5,25.89,23.07,61.65,23.07,61.65s-27.12,11.27-63.76,11.1c-37.52-0.53-63.59-9.51-63.59-9.51s5.81-34.7,21.66-61.82 C230.29,270.35,255.21,246.4,255.21,246.4z M153.41,261.17L256.42,74.33l70.68,128.2c8.42,51.22,5.65,107.88-2.38,140.27 c-3.5-14.36-9.64-32.72-20.28-49.2c-28.27-43.79-47.74-58.99-47.74-58.99s-0.36,0.2-1.01,0.63 c-42.74,11.66-77.73,28.09-123.62,64.64L153.41,261.17z M50.4,448.02l69.84-126.68c39.4-37.4,94.72-65.51,118.02-70.6 c-9.71,10.52-22.24,27.08-35.09,52.2c-18.12,35.42-20.61,64.11-20.61,64.11s0.59,0.37,1.78,0.99l-1.55-0.36 c29.53,30.52,56.36,49.88,116.46,80.35h-42.83H50.4z" [attr.fill]="getSentinelColor()"/>
          </svg>
          
          <div style="font-family: 'Inter', sans-serif; font-size: 22px; letter-spacing: -0.5px; line-height: 1;">
            <span style="font-weight: 700; color: #FFFFFF;">RPR </span>
            <span style="font-weight: 400;" [style.color]="getSentinelColor()">VERIFY</span>
          </div>
        </div>

        <nav style="display: flex; gap: 30px;">
          <a routerLink="/information" routerLinkActive="active-info" style="text-decoration: none; color: #999999; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; padding: 8px 16px;">INFORMATION</a>
          <a routerLink="/transactions" routerLinkActive="active-trans" style="text-decoration: none; color: #999999; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; padding: 8px 16px;">TRANSACTIONS</a>
          <a routerLink="/verification" routerLinkActive="active-verify" style="text-decoration: none; color: #999999; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; padding: 8px 16px;">VERIFICATION</a>
          <a routerLink="/resolution" routerLinkActive="active-reso" style="text-decoration: none; color: #999999; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; padding: 8px 16px;">RESOLUTION</a>
        </nav>

        <div style="display: flex; align-items: center; gap: 32px;">
          
          <div *ngIf="identity.currentUserId()" 
               style="display: flex; flex-direction: column; align-items: flex-end;">
            <span style="font-size: 8px; color: #666666; letter-spacing: 0.2em; text-transform: uppercase;">Monitored Subject</span>
            <span style="font-size: 12px; font-weight: 700; color: #00E0FF; letter-spacing: 0.1em; font-family: monospace;">
              {{ identity.currentUserId() }}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; padding-left: 32px; border-left: 1px solid #1a1a1a;">
            <span style="color: #FFFFFF; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">ADMIN</span>
            <div [style.background]="getSentinelColor()" style="width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 10px currentColor;"></div>
          </div>

        </div>
      </header>

      <div style="padding: 12px 40px; border-bottom: 1px solid #1a1a1a; text-align: right;">
        <span style="color: #666666; font-size: 10px; font-weight: 500; letter-spacing: 0.15em;">RPR COMMUNICATIONS, LLC</span>
      </div>
    </div>

    <div style="padding-top: 140px; min-height: calc(100vh - 80px); padding-bottom: 80px;">
      <router-outlet></router-outlet>
    </div>

    <footer style="position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-top: 1px solid #1a1a1a; background: #000000; z-index: 999;">
      <div style="color: #666666; font-size: 10px; letter-spacing: 0.05em;">© 2025 RPR COMMUNICATIONS LLC</div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <div [ngStyle]="{'width': '8px', 'height': '8px', 'border-radius': '50%', 'background': getSentinelColor()}"></div>
        <span style="color: #FFFFFF; font-size: 10px; font-weight: 600; letter-spacing: 0.1em;">SENTINEL PROTOCOL</span>
      </div>
    </footer>
  `
})
export class App {
  identity = inject(IdentityService);
  sentinelStatus: 'connected' | 'network_down' | 'escalate' = 'connected';

  getSentinelColor(): string {
    // Dual-state color map: Cyan for proactive, Red for escalation
    return this.identity.isEscalated() ? '#FF0000' : '#00E0FF';
  }

  constructor() {
    // Auto-update Sentinel status based on IdentityService escalation state
    effect(() => {
      if (this.identity.isEscalated()) {
        this.sentinelStatus = 'escalate';
      } else {
        this.sentinelStatus = 'connected';
      }
    });
  }
}

