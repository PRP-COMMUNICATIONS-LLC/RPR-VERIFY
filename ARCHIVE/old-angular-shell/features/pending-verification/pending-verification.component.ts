import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TransactionRow {
  caseId: string;
  fullName: string;
  postcode: string;
  amount: number;
  date: string;
  isEscalated: boolean;
}

@Component({
  selector: 'app-pending-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-verification.component.html',
  styleUrls: ['./pending-verification.component.scss']
})
export class PendingVerificationComponent {
  selectedWeek = signal('2025-W52');
  
  weeklyData = signal<TransactionRow[]>([
    { 
      caseId: 'VASILE-2025-052', 
      fullName: 'GAVRIL VASILE', 
      postcode: '6166', 
      amount: 5000.00, 
      date: '2025-10-20',
      isEscalated: false 
    }
  ]);

  // Reactive calculation for Weekly Total
  weeklyTotal = computed(() => {
    return this.weeklyData().reduce((acc, row) => acc + row.amount, 0);
  });

  toggleEscalation(row: TransactionRow) {
    // In a real app, this would call a backend service to persist the flag
    row.isEscalated = !row.isEscalated;
    console.log(`Case ${row.caseId} escalation state: ${row.isEscalated}`);
  }

  downloadWeeklyReport() {
    console.log(`Generating PDF report for ${this.selectedWeek()}...`);
    // Future link: GET /api/v1/reports/weekly/2025-W52
  }
}
