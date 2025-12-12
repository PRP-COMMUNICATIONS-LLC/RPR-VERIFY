import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Case {
    id: string;
    subject: string;
    status: 'Pending' | 'In Review' | 'Resolved';
    risk: 'High' | 'Medium' | 'Low';
    date: string;
    assignedTo: string;
}

import { ReplacePipe } from '../../shared/pipes/replace.pipe';

@Component({
    selector: 'app-cases-list',
    standalone: true,
    imports: [CommonModule, RouterModule, ReplacePipe],
    templateUrl: './cases-list.component.html',
    styles: [`
    :host { display: block; }
    .table-card,
    .cases-card,
    .table-wrapper {
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
    }
    .table-container {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th {
      text-align: left;
      padding: 12px 16px;
      color: var(--rpr-mid-gray);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 500;
    }
    td {
      padding: 16px;
      color: var(--rpr-white);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    tr:last-child td { border-bottom: none; }
    .status-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 4px;              /* small radius, not a pill */
      font-size: 12px;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
    }
    /* Variants – same colors as other cards */
    .status-in-review {
      border-color: #00D9CC;
      color: #00D9CC;
    }
    .status-pending {
      border-color: #5E5E5E;
      color: #B4BCC8;
    }
    .status-resolved {
      border-color: #00E676;
      color: #00E676;
    }
    
    .risk-High { color: var(--rpr-alert-red); }
    .risk-Medium { color: #facc15; }
    .risk-Low { color: #00e676; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CasesListComponent {
    cases = signal<Case[]>([
        { id: 'CASE-2024-001', subject: 'Suspicious Activity', status: 'In Review', risk: 'High', date: '2024-07-29', assignedTo: 'Jane Doe' },
        { id: 'CASE-2024-002', subject: 'KYC Verification', status: 'Pending', risk: 'Medium', date: '2024-07-28', assignedTo: 'John Smith' },
        { id: 'CASE-2024-003', subject: 'Transaction Alert', status: 'Resolved', risk: 'Low', date: '2024-07-27', assignedTo: 'Peter Jones' },
        { id: 'CASE-2024-004', subject: 'Sanctions Hit', status: 'In Review', risk: 'High', date: '2024-07-26', assignedTo: 'Jane Doe' },
        { id: 'CASE-2024-005', subject: 'Fraud Application', status: 'Pending', risk: 'Medium', date: '2024-07-25', assignedTo: 'Emily White' },
    ]);
}
