import { Component, Input } from '@angular/core';


export interface KpiData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [],
  template: `
    <div class="kpi-card" [style.border-left-color]="data.color || '#00d4aa'">
      <div class="kpi-header">
        <div class="kpi-title">{{ data.title }}</div>
        @if (data.icon) {
          <div class="kpi-icon">
            <i [class]="data.icon"></i>
          </div>
        }
      </div>

      <div class="kpi-value">{{ data.value }}</div>

      @if (data.change !== undefined) {
        <div class="kpi-change">
          <span
            class="change-indicator"
            [class]="getChangeClass()"
          >
            <i [class]="getTrendIcon()"></i>
            {{ Math.abs(data.change) }}%
          </span>
          @if (data.changeLabel) {
            <span class="change-label">
              {{ data.changeLabel }}
            </span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .kpi-card {
      background: #0f0f0f;
      border: 1px solid #234a3e;
      border-left: 4px solid;
      border-radius: 8px;
      padding: 16px;
      position: relative;
      transition: all 0.3s ease;
    }

    .kpi-card:hover {
      border-color: #00d4aa;
      box-shadow: 0 4px 12px rgba(0, 212, 170, 0.1);
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .kpi-title {
      font-size: 12px;
      font-weight: 700;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-icon {
      color: #00d4aa;
      font-size: 16px;
    }

    .kpi-value {
      font-size: 24px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 8px;
    }

    .kpi-change {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .change-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
    }

    .change-indicator.positive {
      background: rgba(0, 212, 170, 0.1);
      color: #00d4aa;
    }

    .change-indicator.negative {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .change-indicator.neutral {
      background: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
    }

    .change-label {
      color: #888;
      font-size: 11px;
    }
  `]
})
export class KpiCardComponent {
  @Input() data!: KpiData;

  // Explicitly expose Math to the template
  protected readonly Math = Math;

  getChangeClass(): string {
    if (!this.data.change) return 'neutral';
    return this.data.change > 0 ? 'positive' : 'negative';
  }

  getTrendIcon(): string {
    if (!this.data.trend) {
      return this.data.change && this.data.change > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    }

    switch (this.data.trend) {
      case 'up': return 'fas fa-arrow-up';
      case 'down': return 'fas fa-arrow-down';
      default: return 'fas fa-minus';
    }
  }
}