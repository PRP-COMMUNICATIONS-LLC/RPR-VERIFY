import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

export type SovereignMode = 'MONITOR' | 'ALERT';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  // Mode state - defaults to MONITOR
  mode = signal<SovereignMode>('MONITOR');

  // Computed properties
  isAlert = computed(() => this.mode() === 'ALERT');

  headerLabel = computed(() =>
    this.isAlert()
      ? 'SOVEREIGN SHELL · ALERT MODE'
      : 'SOVEREIGN SHELL · MONITOR MODE'
  );

  headerSubtitle = computed(() =>
    this.isAlert()
      ? 'Disputes / Crisis Operations Rail'
      : 'Standard Monitoring / Ingestion Rail'
  );

  // Toggle between MONITOR and ALERT modes
  toggleMode(): void {
    this.mode.update((current) =>
      current === 'MONITOR' ? 'ALERT' : 'MONITOR'
    );
  }
}
