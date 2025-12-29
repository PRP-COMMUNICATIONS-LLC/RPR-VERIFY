import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-quality-score-badge',
  template: `
    <div class="score-badge" [ngClass]="{ 'high-confidence': score >= 90 }">
      <span class="score-value">{{ score | number:'1.0-0' }}</span>
      <span class="score-label">Score</span>
    </div>
  `,
  styleUrls: ['./quality-score-badge.component.scss'],
  imports: [CommonModule]
})
export class QualityScoreBadgeComponent {
  @Input({ required: true }) score!: number;
}
