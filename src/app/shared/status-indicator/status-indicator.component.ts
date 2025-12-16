import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Assuming we have an icon system available (e.g., a simple 'check' or 'exclamation' icon)
// If not, this is text-only, but the component structure is ready for icons.

export type DocumentStatus = 'Pass' | 'Flagged' | 'Error';

@Component({
  standalone: true,
  selector: 'rpr-status-indicator',
  template: `
    <span class="status-badge" [ngClass]="statusClass()">
      {{ status | uppercase }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.85em;
      min-width: 80px;
      text-align: center;
    }
    .status-pass {
      background-color: #d4edda; /* Light Green */
      color: #155724; /* Dark Green */
    }
    .status-flagged {
      background-color: #fff3cd; /* Light Yellow */
      color: #856404; /* Dark Yellow */
    }
    .status-error {
      background-color: #f8d7da; /* Light Red */
      color: #721c24; /* Dark Red */
    }
  `],
  imports: [CommonModule]
})
export class StatusIndicatorComponent {
  @Input({ required: true }) status!: DocumentStatus;

  statusClass = computed(() => {
    switch (this.status) {
      case 'Pass':
        return 'status-pass';
      case 'Flagged':
        return 'status-flagged';
      case 'Error':
        return 'status-error';
      default:
        return '';
    }
  });
}
