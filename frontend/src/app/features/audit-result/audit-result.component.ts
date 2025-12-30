import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditResponse } from '../../core/services/vision.service';

@Component({
  selector: 'app-audit-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="auditResult" [class.variance-alert]="isVarianceHigh()">
      <h4>Audit Result:</h4>
      <pre>{{ auditResult | json }}</pre>
    </div>
  `,
  styleUrls: ['./audit-result.component.css']
})
export class AuditResultComponent {
  @Input() auditResult: AuditResponse | null = null;

  isVarianceHigh(): boolean {
    if (this.auditResult && this.auditResult.risk_score !== undefined) {
      return this.auditResult.risk_score > 0.011;
    }
    return false;
  }
}