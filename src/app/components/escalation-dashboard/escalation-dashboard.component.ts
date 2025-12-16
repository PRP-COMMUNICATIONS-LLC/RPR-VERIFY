import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type EscalationLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EscalationStatus = 'IDLE' | 'PENDING' | 'ACTIVE' | 'RESOLVED' | 'FAILED';

export interface EscalationRow {
  reportId: string;
  escalationLevel: EscalationLevel;
  routeTarget: string;
  status: EscalationStatus;
  lastUpdated: string;
}

@Component({
  selector: 'app-escalation-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escalation-dashboard.component.html',
  styleUrls: ['./escalation-dashboard.component.css']
})
export class EscalationDashboardComponent {
  rows: EscalationRow[] = [
    {
      reportId: 'RPR-2025-0001',
      escalationLevel: 'HIGH',
      routeTarget: 'CLIENT_SERVICE_MANAGER',
      status: 'ACTIVE',
      lastUpdated: '2025-12-16 10:30',
    },
    {
      reportId: 'RPR-2025-0002',
      escalationLevel: 'MEDIUM',
      routeTarget: 'QA_REVIEW',
      status: 'PENDING',
      lastUpdated: '2025-12-16 10:20',
    },
    {
      reportId: 'RPR-2025-0003',
      escalationLevel: 'CRITICAL',
      routeTarget: 'SENIOR_OPS',
      status: 'ACTIVE',
      lastUpdated: '2025-12-16 09:58',
    },
    {
      reportId: 'RPR-2025-0004',
      escalationLevel: 'LOW',
      routeTarget: 'AUTOMATED_ROUTER',
      status: 'RESOLVED',
      lastUpdated: '2025-12-15 17:41',
    }
  ];

  onResolve(row: EscalationRow) {
    if (row.status !== 'RESOLVED') {
      row.status = 'RESOLVED';
      row.lastUpdated = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
  }
}
