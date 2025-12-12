
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Case = {
  id: string;
  subject: string;
  status: 'Pending' | 'In Review' | 'Resolved';
  risk: 'High' | 'Medium' | 'Low';
  date: string;
  assignedTo: string;
};

@Component({
  selector: 'app-cases',
  imports: [CommonModule],
  templateUrl: './cases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CasesComponent {
  cases = signal<Case[]>([
    {
      id: 'CASE-2024-001',
      subject: 'Suspicious Activity Report',
      status: 'In Review',
      risk: 'High',
      date: '2024-07-29',
      assignedTo: 'Jane Doe',
    },
    {
      id: 'CASE-2024-002',
      subject: 'KYC Verification',
      status: 'Pending',
      risk: 'Medium',
      date: '2024-07-28',
      assignedTo: 'John Smith',
    },
    {
      id: 'CASE-2024-003',
      subject: 'Transaction Monitoring Alert',
      status: 'Resolved',
      risk: 'Low',
      date: '2024-07-27',
      assignedTo: 'Peter Jones',
    },
    {
      id: 'CASE-2024-004',
      subject: 'Sanctions Screening Hit',
      status: 'In Review',
      risk: 'High',
      date: '2024-07-26',
      assignedTo: 'Jane Doe',
    },
    {
      id: 'CASE-2024-005',
      subject: 'Fraudulent Application',
      status: 'Pending',
      risk: 'Medium',
      date: '2024-07-25',
      assignedTo: 'Emily White',
    },
  ]);
}
