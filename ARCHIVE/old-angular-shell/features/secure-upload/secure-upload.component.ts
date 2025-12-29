import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secure-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secure-upload.component.html',
  styleUrls: ['./secure-upload.component.scss']
})
export class SecureUploadComponent {
  isBusinessMode = signal(false);
  companyName = signal('');
  bankName = signal('');
  accountNumber = signal('');

  docRows = computed(() => [
    { label: 'PROOF OF ID', status: 'PENDING' },
    { label: 'PROOF OF ADDRESS', status: 'PENDING' },
    { label: 'PROOF OF BANK OWNERSHIP', status: 'PENDING' },
    { label: 'ABN CERTIFICATE', status: 'PENDING' } // Terminology corrected
  ]);

  recentTransactions = signal([
    { date: '2025-10-20', amount: '$5,000.00', reference: 'A0722502459' }
  ]);

  toggleMode() {
    this.isBusinessMode.update(val => !val);
  }
}
