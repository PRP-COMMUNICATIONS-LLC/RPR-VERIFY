import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-disputes',
  templateUrl: './disputes.component.html',
  styles: [`
    .dispute-panel,
    .timeline-panel,
    .evidence-panel,
    .outcomes-panel,
    .related-cases-panel {
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
    }
    .file-action,
    .view-button {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 4px;                /* rectangular, consistent with tags */
      font-size: 11px;
      font-weight: 500;
      background: transparent;
      border: 1px solid var(--accent-primary);
      color: var(--accent-primary);
      cursor: pointer;
    }
    .file-action:hover,
    .view-button:hover {
      background: rgba(0, 217, 204, 0.12);
    }
    .resolve-dispute-button,
    .submit-button,
    .outcome-submit-button,
    .btn-primary {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: #000000;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }
    .resolve-dispute-button:hover,
    .submit-button:hover,
    .outcome-submit-button:hover,
    .btn-primary:hover {
      background: var(--accent-hover);
      border-color: var(--accent-hover);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisputesComponent { }
