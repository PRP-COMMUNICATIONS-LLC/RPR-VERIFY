import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cis-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cis-report.component.html',
  styleUrls: ['./cis-report.component.scss']
})
export class CisReportComponent {
  searchUserId = '';
  selectedUser = signal<any>(null);

  // Mock lookup function to simulate calling the backend
  lookupUser() {
    if (this.searchUserId.includes('VASILE')) {
      this.selectedUser.set({
        fullName: 'GAVRIL VASILE',
        postcode: '6166',
        abnStatus: 'ACTIVE',
        entityName: 'THE ARDEAL TRADING TRUST',
        transactions: [
          { date: '2025-10-20', description: 'Osko Deposit - Victor V Lo Pty Ltd', debit: 0, credit: 5000, balance: 5000 },
          { date: '2025-10-21', description: 'Internal Transfer', debit: 1000, credit: 0, balance: 4000 }
        ]
      });
    } else {
      alert('USER ID NOT FOUND');
    }
  }

  generateDossier() {
    console.log('Packaging forensic dossier for selection...');
    // Future link: POST /api/v1/cases/generate-dossier
  }
}
