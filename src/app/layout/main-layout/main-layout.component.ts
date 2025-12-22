// src/app/layout/main-layout/main-layout.component.ts

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-shell">
      <header class="rpr-header">
        <a routerLink="/" class="brand-lockup">
          <span class="brand-rpr">RPR</span>
          <span class="brand-verify">VERIFY</span>
        </a>
        
        <nav class="rpr-nav">
          <div class="status-indicator">
            <span class="dot"></span> SYSTEM ACTIVE
          </div>
        </nav>
      </header>

      <main class="rpr-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="rpr-footer">
        <p>RPR-KONTROL [v1.0] | SOVEREIGN VERIFICATION NODE | ASIA-SOUTHEAST1</p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .rpr-header {
      background: rgba(0, 0, 0, 0.9);
      border-bottom: 1px solid var(--rpr-audit-cyan);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
    }

    .brand-lockup {
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -0.05em;
      user-select: none;
      text-decoration: none; /* Remove underline */
      cursor: pointer;
      display: flex; /* Ensure spans sit correctly */
      align-items: center;
    }

    .brand-rpr { color: white; }
    .brand-verify { color: var(--rpr-audit-cyan); }

    .status-indicator {
      font-family: var(--font-data);
      font-size: 0.75rem;
      color: var(--rpr-audit-cyan);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      background-color: var(--rpr-audit-cyan);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--rpr-audit-cyan);
    }

    .rpr-content {
      flex: 1;
      position: relative;
    }

    .rpr-footer {
      border-top: 1px solid #222;
      padding: 1rem;
      text-align: center;
      font-family: var(--font-data);
      font-size: 0.7rem;
      color: #444;
      background: var(--rpr-black);
    }
  `]
})
export class MainLayoutComponent {}
