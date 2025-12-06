// src/app/components/cases-list/cases-list.component.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Case {
  id: string;
  title: string;
  type: string;
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  riskLevel: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  dateOpened: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-cases-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgClass],
  templateUrl: './cases-list.component.html',
  styles: []
})
export class CasesListComponent {
  filterType = 'All';
  filterStatus = 'All';
  filterRisk = 'All';

  readonly allCases = signal<Case[]>([
    {
      id: 'RPR-001',
      title: 'Suspicious Activity on Account X123',
      type: 'Fraud',
      status: 'Open',
      riskLevel: 'High',
      assignedTo: 'John Doe',
      dateOpened: '2023-10-26',
      lastUpdated: '2023-10-27',
    },
    {
      id: 'RPR-002',
      title: 'Compliance Check for Q3 Report',
      type: 'Compliance',
      status: 'Pending',
      riskLevel: 'Medium',
      assignedTo: 'Jane Smith',
      dateOpened: '2023-10-20',
      lastUpdated: '2023-10-25',
    },
    {
      id: 'RPR-003',
      title: 'Unauthorized Access Attempt',
      type: 'Security',
      status: 'Resolved',
      riskLevel: 'High',
      assignedTo: 'John Doe',
      dateOpened: '2023-10-15',
      lastUpdated: '2023-10-18',
    },
    {
      id: 'RPR-004',
      title: 'Policy Violation Flag',
      type: 'Compliance',
      status: 'Open',
      riskLevel: 'Low',
      assignedTo: 'Alice Green',
      dateOpened: '2023-10-28',
      lastUpdated: '2023-10-28',
    },
    {
      id: 'RPR-005',
      title: 'Fraudulent Transaction Investigation',
      type: 'Fraud',
      status: 'Pending',
      riskLevel: 'Medium',
      assignedTo: 'Jane Smith',
      dateOpened: '2023-10-29',
      lastUpdated: '2023-10-30',
    },
    {
      id: 'RPR-006',
      title: 'Data Breach Assessment',
      type: 'Security',
      status: 'Closed',
      riskLevel: 'High',
      assignedTo: 'Bob White',
      dateOpened: '2023-09-01',
      lastUpdated: '2023-09-10',
    },
  ]);

  readonly filteredCases = computed(() => {
    const type = this.filterType;
    const status = this.filterStatus;
    const risk = this.filterRisk;

    return this.allCases().filter((c) => {
      const matchesType = type === 'All' || c.type === type;
      const matchesStatus = status === 'All' || c.status === status;
      const matchesRisk = risk === 'All' || c.riskLevel === risk;
      return matchesType && matchesStatus && matchesRisk;
    });
  });

  applyFilters(): void {
    // Triggers recomputation via computed signal
  }

  trackById(_: number, item: Case): string {
    return item.id;
  }

  statusChipClass(status: Case['status']): string {
    switch (status) {
      case 'Resolved':
        return 'bg-teal-brand/20 text-teal-brand';
      case 'Pending':
        return 'bg-amber-400/20 text-amber-300';
      case 'Open':
        return 'bg-sky-400/20 text-sky-300';
      case 'Closed':
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  }

  riskChipClass(risk: Case['riskLevel']): string {
    switch (risk) {
      case 'Low':
        return 'bg-green-500/20 text-green-400';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'High':
      default:
        return 'bg-red-500/20 text-red-400';
    }
  }
}
