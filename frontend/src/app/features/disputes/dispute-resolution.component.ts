import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrandLogoComponent } from '../../core/components/brand-logo/brand-logo.component';

interface CaseTimeline {
  date: string;
  action: string;
  note: string;
}

interface CaseData {
  id: string;
  customerId: string;
  caseType: 'ESCROW_DISPUTE' | 'FRAUD_ALERT' | 'COMPLIANCE_VIOLATION' | 'PAYMENT_DISPUTE';
  status: 'OPEN' | 'PENDING_REVIEW' | 'ESCALATED' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  amount: number;
  timeline: CaseTimeline[];
}


@Component({
  selector: 'app-dispute-resolution',
  standalone: true,
  imports: [CommonModule, BrandLogoComponent],
  templateUrl: './dispute-resolution.component.html',
  styleUrls: ['./dispute-resolution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisputeResolutionComponent implements OnInit {
  private router = inject(Router);

  // Canonical State Initialization - Tab 4 Resolution
  caseData: CaseData[] = [
    {
      id: 'CASE-2025-001',
      customerId: 'SMITH/2025/52',
      caseType: 'ESCROW_DISPUTE',
      status: 'ESCALATED', // Renders Red Badge
      priority: 'HIGH',
      amount: 15450.00,
      timeline: [
        { date: '2025-12-20', action: 'CASE_OPENED', note: 'Initial dispute filed' },
        { date: '2025-12-21', action: 'ESCALATED', note: 'Routed to escalation committee' },
        { date: '2025-12-22', action: 'REVIEW_IN_PROGRESS', note: 'Forensic analysis underway' }
      ]
    },
    {
      id: 'CASE-2025-002',
      customerId: 'USR/2025/53',
      caseType: 'FRAUD_ALERT',
      status: 'OPEN',
      priority: 'CRITICAL',
      amount: 1250.50,
      timeline: [
        { date: '2025-12-23', action: 'CASE_OPENED', note: 'Fraud detector triggered' }
      ]
    }
  ];

  activeCaseId: string = 'CASE-2025-001';
  selectedCase: CaseData | null = null;

  ngOnInit() {
    // Initialize with active case
    this.updateSelectedCase();
  }

  selectCase(caseId: string) {
    this.activeCaseId = caseId;
    this.updateSelectedCase();
  }

  private updateSelectedCase() {
    this.selectedCase = this.caseData.find(c => c.id === this.activeCaseId) || null;
  }

  getSelectedCase(): CaseData | null {
    return this.selectedCase;
  }

  updateStatus(newStatus: CaseData['status']) {
    if (this.selectedCase) {
      this.selectedCase.status = newStatus;
      // Add timeline entry
      const today = new Date().toISOString().split('T')[0];
      this.selectedCase.timeline.push({
        date: today,
        action: 'STATUS_UPDATED',
        note: `Status changed to ${newStatus}`
      });
    }
  }

  escalateCase() {
    if (this.selectedCase) {
      this.selectedCase.status = 'ESCALATED';
      this.selectedCase.priority = 'CRITICAL';
      // Add timeline entry
      const today = new Date().toISOString().split('T')[0];
      this.selectedCase.timeline.push({
        date: today,
        action: 'ESCALATED',
        note: 'Case escalated to senior management'
      });
    }
  }

  generateReport() {
    // Navigate to report generation (placeholder)
    console.log('Generating resolution report for case:', this.selectedCase?.id);
  }

  getStatusClass(status: CaseData['status']): string {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'PENDING_REVIEW': return 'status-pending';
      case 'ESCALATED': return 'status-escalated';
      case 'RESOLVED': return 'status-resolved';
      default: return '';
    }
  }

  getPriorityClass(priority: CaseData['priority']): string {
    switch (priority) {
      case 'LOW': return 'priority-low';
      case 'MEDIUM': return 'priority-medium';
      case 'HIGH': return 'priority-high';
      case 'CRITICAL': return 'priority-critical';
      default: return '';
    }
  }
}