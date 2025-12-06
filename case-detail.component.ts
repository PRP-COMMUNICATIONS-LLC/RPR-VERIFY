// src/app/components/case-detail/case-detail.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface DocumentItem {
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  url: string;
}

interface HistoryItem {
  timestamp: string;
  action: string;
  user: string;
}

interface DisputeItem {
  id: string;
  summary: string;
  status: 'Open' | 'Closed' | 'Pending';
}

interface CaseDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  riskLevel: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  dateOpened: string;
  lastUpdated: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  notes: string[];
  documents: DocumentItem[];
  history: HistoryItem[];
  disputes: DisputeItem[];
}

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass, RouterLink],
  templateUrl: './case-detail.component.html',
  styles: []
})
export class CaseDetailComponent implements OnInit {
  readonly caseId = signal<string | null>(null);
  readonly caseDetail = signal<CaseDetail | null>(null);
  readonly activeTab = signal<'Overview' | 'Documents' | 'Notes' | 'History' | 'Disputes'>('Overview');

  readonly tabs = [
    { name: 'Overview' as const, label: 'Overview' },
    { name: 'Documents' as const, label: 'Documents' },
    { name: 'Notes' as const, label: 'Notes' },
    { name: 'History' as const, label: 'History' },
    { name: 'Disputes' as const, label: 'Disputes' },
  ];

  private readonly mockCases: CaseDetail[] = [
    {
      id: 'RPR-001',
      title: 'Suspicious Activity on Account X123',
      description: 'Detailed investigation into unusual transaction patterns and login attempts from a new geographical location.',
      type: 'Fraud',
      status: 'Open',
      riskLevel: 'High',
      assignedTo: 'John Doe',
      dateOpened: '2023-10-26',
      lastUpdated: '2023-10-27',
      priority: 'High',
      tags: ['transaction', 'login', 'fraud', 'investigation'],
      notes: [
        'Initial alert triggered by system anomaly detection at 14:30 UTC.',
        'Contacted account holder, awaiting response. Account temporarily locked.',
        'Assigned to John Doe for further investigation. Escalated to Tier 2.',
      ],
      documents: [
        {
          name: 'Fraud_Report_RPR-001.pdf',
          type: 'PDF',
          uploadedBy: 'System',
          uploadDate: '2023-10-26',
          url: '#',
        },
        {
          name: 'Account_Activity_Log.csv',
          type: 'CSV',
          uploadedBy: 'John Doe',
          uploadDate: '2023-10-27',
          url: '#',
        },
      ],
      history: [
        {
          timestamp: '2023-10-27 10:00',
          action: 'Case status updated to Open',
          user: 'John Doe',
        },
        {
          timestamp: '2023-10-26 15:00',
          action: 'Case assigned to John Doe',
          user: 'System',
        },
        {
          timestamp: '2023-10-26 14:30',
          action: 'Case created from fraud alert',
          user: 'System',
        },
      ],
      disputes: [
        {
          id: 'DPT-001',
          summary: 'Customer disputes unauthorized charges',
          status: 'Open',
        },
      ],
    },
  ];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.caseDetail.set(null);
        return;
      }
      this.caseId.set(id);
      this.loadCaseDetail(id);
    });
  }

  private loadCaseDetail(id: string): void {
    const found = this.mockCases.find((c) => c.id === id);
    this.caseDetail.set(found ?? null);
  }

  selectTab(tabName: CaseDetailComponent['activeTab']['value']): void {
    this.activeTab.set(tabName);
  }

  statusChipClass(status: CaseDetail['status'] | undefined): string {
    switch (status) {
      case 'Open': return 'bg-sky-400/20 text-sky-300';
      case 'Pending': return 'bg-amber-400/20 text-amber-300';
      case 'Resolved': return 'bg-teal-brand/20 text-teal-brand';
      case 'Closed':
      default: return 'bg-gray-500/20 text-gray-300';
    }
  }

  riskChipClass(risk: CaseDetail['riskLevel'] | undefined): string {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'High':
      default: return 'bg-red-500/20 text-red-400';
    }
  }

  disputeStatusChipClass(status: DisputeItem['status']): string {
    switch (status) {
      case 'Open': return 'bg-sky-400/20 text-sky-300';
      case 'Pending': return 'bg-amber-400/20 text-amber-300';
      case 'Closed':
      default: return 'bg-gray-500/20 text-gray-300';
    }
  }

  trackTab(_: number, tab: { name: string }): string {
    return tab.name;
  }

  trackTag(_: number, tag: string): string {
    return tag;
  }

  trackDoc(_: number, doc: DocumentItem): string {
    return doc.name;
  }

  trackNote(index: number): number {
    return index;
  }

  trackHistory(_: number, item: HistoryItem): string {
    return item.timestamp + item.user;
  }

  trackDispute(_: number, item: DisputeItem): string {
    return item.id;
  }
}
