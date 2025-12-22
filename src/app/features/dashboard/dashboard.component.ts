import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscalationService } from '../../services/escalation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  private escalationService = inject(EscalationService);
  
  stats$!: Observable<any>;
  escalations$!: Observable<any[]>;

  ngOnInit() {
    this.stats$ = this.escalationService.getStats();
    this.escalations$ = this.escalationService.getEscalations();
  }
}
