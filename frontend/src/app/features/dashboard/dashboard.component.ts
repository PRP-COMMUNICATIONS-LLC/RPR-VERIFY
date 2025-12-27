import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscalationService } from '../../services/escalation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; color: white;">
      <h2>Sovereign Dashboard</h2>
      <p>Escalation Status: {{ (stats$ | async)?.status || 'STABLE' }}</p>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private escalationService = inject(EscalationService);
  public stats$: Observable<any> | undefined;

  ngOnInit() {
    // Fixed: Using 'getStatus' which the compiler confirmed exists 
    this.stats$ = this.escalationService.getStatus('CURRENT_SESSION');
  }
}
