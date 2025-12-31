import { Component } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { StatusBadgeComponent, StatusType } from '../../shared/components/status-badge/status-badge.component';

export interface AccountStatement {
  customerId: string;
  period: string;
  amount: number;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

@Component({
  selector: 'app-secure-upload',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    StatusBadgeComponent
],
  templateUrl: './secure-upload.component.html',
  styleUrls: ['./secure-upload.component.scss']
})
export class SecureUploadComponent {
  displayedColumns: string[] = ['customerId', 'period', 'amount', 'status'];

  accountStatements: AccountStatement[] = [
    {
      customerId: 'SMITH/2025/52',
      period: '2025-W52',
      amount: 5000.00,
      status: 'VERIFIED'
    },
    {
      customerId: 'USR/2025/53',
      period: '2025-W52',
      amount: 1250.00,
      status: 'PENDING'
    },
    {
      customerId: 'USR/2025/54',
      period: '2025-W52',
      amount: 800.00,
      status: 'PENDING'
    }
  ];

  getStatusType(status: string): StatusType {
    const s = status.toLowerCase();
    // Validate that the string matches one of the allowed StatusType literals
    if (['verified', 'pending', 'critical', 'high', 'medium', 'low', 'in_progress', 'resolved', 'flagged', 'success', 'warning', 'error', 'info', 'approved', 'rejected', 'review'].includes(s)) {
      return s as StatusType;
    }
    return 'pending'; // Default fallback
  }
}