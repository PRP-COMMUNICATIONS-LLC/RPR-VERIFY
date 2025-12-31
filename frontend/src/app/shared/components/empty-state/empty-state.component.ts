import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  template: `
    <div class="empty-state">
      <div class="empty-icon">
        <i [class]="icon"></i>
      </div>

      <h3 class="empty-title">{{ title }}</h3>

      <p class="empty-description">{{ description }}</p>

      @if (showAction) {
        <div class="empty-actions">
          <button
            class="action-button"
            (click)="onActionClick()"
            [disabled]="actionDisabled"
          >
            {{ actionText }}
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      background: #0f0f0f;
      border: 1px solid #234a3e;
      border-radius: 8px;
      min-height: 200px;
    }

    .empty-icon {
      font-size: 48px;
      color: #00d4aa;
      margin-bottom: 16px;
      opacity: 0.7;
    }

    .empty-title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .empty-description {
      font-size: 14px;
      color: #888;
      margin-bottom: 24px;
      max-width: 400px;
      line-height: 1.5;
    }

    .empty-actions {
      margin-top: 16px;
    }

    .action-button {
      background: linear-gradient(135deg, #00d4aa, #00b8a0);
      color: #000;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'fas fa-inbox';
  @Input() title = 'No data available';
  @Input() description = 'There are no items to display at this time.';
  @Input() showAction = false;
  @Input() actionText = 'Get Started';
  @Input() actionDisabled = false;

  onActionClick(): void {
    // Emit action event or handle navigation
    console.log('Empty state action clicked');
  }
}