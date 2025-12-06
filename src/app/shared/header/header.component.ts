import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header" [ngClass]="{'status-ok': status() === 'ok', 'status-error': status() === 'error'}">
      <div class="brand-block">
        <img
          src="assets/rpr-verify-logo.svg"
          alt="RPR Verify - Compliance Risk Management Platform"
          aria-label="RPR Verify Logo"
          class="brand-logo"
          height="60"
        />
        <!-- AG-LESSON: Logo tagline removed and main logo enlarged by 50% per Founder spec. -->
        <!-- AG-LESSON: Header tagline updated to new doctrine phrase. -->
        <span class="header-tagline">FROM PROACTIVE COMPLIANCE & ESCALATION DOMINANCE</span>
      </div>
      <div class="header-actions">
        <!-- Placeholder for user profile or actions -->
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      padding: 16px 24px;
      background-color: var(--rpr-ink);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-block {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .header-tagline {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 0.05em;
      border-left: 1px solid rgba(255,255,255,0.3);
      padding-left: 20px;
    }
    .rpr-logo, .brand-logo {
      transition: filter 0.3s ease;
    }
    .status-ok .brand-logo {
      filter: drop-shadow(0 0 14px #00e0ff);
    }
    .status-error .brand-logo {
      filter: drop-shadow(0 0 14px #ff3366);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnInit, OnDestroy {
  status = signal<'ok' | 'error'>('ok');

  private onlineHandler = () => this.updateStatus();
  private offlineHandler = () => this.updateStatus();

  ngOnInit(): void {
    this.updateStatus();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.onlineHandler);
      window.addEventListener('offline', this.offlineHandler);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.onlineHandler);
      window.removeEventListener('offline', this.offlineHandler);
    }
  }

  updateStatus(): void {
    if (typeof navigator !== 'undefined') {
      this.status.set(navigator.onLine ? 'ok' : 'error');
    }
  }
}
