import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<!-- AG-LESSON: Sidebar strictly 200px fixed width with vertical flex layout as per Handover. -->
<aside class="sidebar">
  <!-- Logo Section (Top) -->
  <div class="sidebar-header">
    <div class="logo">
      <!-- Shield icon placeholder or SVG -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
        <path d="M12 2L3 7V12C3 17.52 6.84 22.74 12 24C17.16 22.74 21 17.52 21 12V7L12 2Z" stroke="#00D9FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div>
        <h1>RPR VERIFY</h1>
        <p>RISK & COMPLIANCE</p>
      </div>
    </div>
  </div>

  <!-- Navigation Items (Middle - flex:1) -->
  <nav class="sidebar-nav">
    <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
      <span class="icon">📊</span>
      <span>Dashboard</span>
    </a>
    <a routerLink="/cases" routerLinkActive="active" class="nav-item">
      <span class="icon">📁</span>
      <span>Cases</span>
    </a>
    <a routerLink="/disputes" routerLinkActive="active" class="nav-item">
      <span class="icon">⚖️</span>
      <span>Disputes</span>
    </a>
    <a routerLink="/reports" routerLinkActive="active" class="nav-item">
      <span class="icon">📋</span>
      <span>Reports</span>
    </a>
    <a routerLink="/settings" routerLinkActive="active" class="nav-item">
      <span class="icon">⚙️</span>
      <span>Settings</span>
    </a>
  </nav>

  <!-- Bottom Actions -->
  <div class="sidebar-footer">
    <a routerLink="/help" class="nav-item">
      <span class="icon">❓</span>
      <span>Help</span>
    </a>
    <a routerLink="/login" class="nav-item">
      <span class="icon">🚪</span>
      <span>Logout</span>
    </a>
  </div>
</aside>
  `,
  styles: [`
/* AG-LESSON: Sidebar must be 200px fixed width with vertical flex layout */
.sidebar {
  width: 200px;
  min-width: 200px;
  height: 100vh;
  background: var(--color-charcoal-800); /* #262828 */
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-card-border);
  position: sticky;
  top: 0;
}

.sidebar-header {
  padding: 24px 16px;
  border-bottom: 1px solid var(--color-card-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo h1 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-teal-300); /* Cyan brand */
  margin: 0;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.logo p {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin: 0;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.sidebar-nav {
  flex: 1; /* Takes remaining space */
  padding: 16px 0;
  overflow-y: auto;
}

.sidebar-nav a,
.sidebar-footer a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  transition: all var(--duration-normal) var(--ease-standard);
  border-left: 4px solid transparent;
  cursor: pointer;
}

.sidebar-nav a:hover,
.sidebar-footer a:hover {
  background: rgba(var(--color-teal-300-rgb), 0.15);
  color: var(--color-text);
}

/* AG-LESSON: Active nav item shows 4px teal left border */
.sidebar-nav a.active {
  background: rgba(var(--color-teal-300-rgb), 0.15);
  border-left-color: var(--color-teal-300);
  color: var(--color-teal-300);
}

.sidebar-footer {
  padding: 16px 0;
  border-top: 1px solid var(--color-card-border);
}

.icon {
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
}
