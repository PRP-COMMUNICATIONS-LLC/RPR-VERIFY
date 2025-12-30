import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscalationService } from '../../core/services/escalation.service';
import { HealthCheckService } from '../../core/services/health-check.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; color: white;">
      <h2>Sovereign Dashboard</h2>
      <p>Escalation Status: {{ (stats$ | async)?.status || 'STABLE' }}</p>
      <p>Notion Bridge: {{ (healthStatus$ | async)?.status === 'peacetime' ? 'Connected' : 'Disconnected' }}</p>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private escalationService = inject(EscalationService);
  private healthCheckService = inject(HealthCheckService);

  public stats$: Observable<any> | undefined;
  public healthStatus$: Observable<{status: string, color: string}> | undefined;

  ngOnInit() {
    this.stats$ = this.escalationService.getStatus('CURRENT_SESSION');
    this.healthStatus$ = this.healthCheckService.checkHealth();
  }
}