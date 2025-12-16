import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'rpr-quality-score-badge',
  template: `
    <span class="score-badge" [ngClass]="scoreClass()">
      {{ score | number:'1.0-0' }} / 100
    </span>
  `,
  styles: [
    `
    .score-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.85rem;
      min-width: 64px;
      text-align: center;
    }
    .score-high { background-color: #d4edda; color: #155724; }
    .score-medium { background-color: #fff3cd; color: #856404; }
    .score-low { background-color: #f8d7da; color: #721c24; }
    `
  ],
  imports: [CommonModule]
})
export class QualityScoreBadgeComponent {
  @Input({ required: true }) score!: number;

  scoreClass(): string {
    if (this.score >= 85) return 'score-high';
    if (this.score >= 50) return 'score-medium';
    return 'score-low';
  }
}
