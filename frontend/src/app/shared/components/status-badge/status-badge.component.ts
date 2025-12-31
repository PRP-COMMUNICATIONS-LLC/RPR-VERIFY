import { Component, Input } from '@angular/core';


export type StatusType = 'verified' | 'pending' | 'critical' | 'high' | 'medium' | 'low' | 'in_progress' | 'resolved' | 'flagged' | 'success' | 'warning' | 'error' | 'info' | 'approved' | 'rejected' | 'review';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [],
  template: `
    <span class="status-badge" [class]="getStatusClass()">
      @if (showIcon) {
        <i [class]="getStatusIcon()"></i>
      }
      {{ text }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      border: 1px solid transparent;
    }

    .status-badge.success {
      background: rgba(0, 212, 170, 0.1);
      color: #00d4aa;
      border-color: rgba(0, 212, 170, 0.3);
    }

    .status-badge.warning {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
      border-color: rgba(251, 191, 36, 0.3);
    }

    .status-badge.error {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .status-badge.info {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.3);
    }

    .status-badge.pending {
      background: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
      border-color: rgba(156, 163, 175, 0.3);
    }

    .status-badge.approved {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      border-color: rgba(34, 197, 94, 0.3);
    }

    .status-badge.rejected {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .status-badge.review {
      background: rgba(168, 85, 247, 0.1);
      color: #a855f7;
      border-color: rgba(168, 85, 247, 0.3);
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: StatusType = 'info';
  @Input() text = '';
  @Input() showIcon = true;

  getStatusClass(): string {
    return this.status;
  }

  getStatusIcon(): string {
    switch (this.status) {
      case 'success':
      case 'approved':
        return 'fas fa-check-circle';
      case 'warning':
      case 'review':
        return 'fas fa-exclamation-triangle';
      case 'error':
      case 'rejected':
        return 'fas fa-times-circle';
      case 'pending':
        return 'fas fa-clock';
      case 'info':
      default:
        return 'fas fa-info-circle';
    }
  }
}