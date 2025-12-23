import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Assuming we have an icon system available (e.g., a simple 'check' or 'exclamation' icon)
// If not, this is text-only, but the component structure is ready for icons.

export type DocumentStatus = 'Pass' | 'Flagged' | 'Error';

@Component({
  standalone: true,
  selector: 'app-status-indicator',
  template: `
    <span class="status-pill" [ngClass]="'risk-' + riskLevel">
      <i class="material-icons" *ngIf="statusIcon()">{{ statusIcon() }}</i>
      {{ statusLabel() }}
    </span>
  `,
  styleUrls: ['./status-indicator.component.scss'],
  imports: [CommonModule]
})
export class StatusIndicatorComponent {
  @Input({ required: true }) riskLevel!: number;

  statusLabel = computed(() => {
    switch (this.riskLevel) {
      case 3: return 'Critical Mismatch';
      case 2: return 'High Discrepancy';
      case 1: return 'Minor Variance';
      case 0: return 'Verified';
      default: return 'Audit Required';
    }
  });

  statusIcon = computed(() => {
    switch (this.riskLevel) {
      case 3: return 'priority_high';
      case 2: return 'warning';
      case 1: return 'info';
      case 0: return 'check_circle';
      default: return 'help_outline';
    }
  });
}
