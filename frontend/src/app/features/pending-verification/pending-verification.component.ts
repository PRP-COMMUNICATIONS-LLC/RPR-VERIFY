import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CisDataService } from '../../core/services/cis-data.service';
import { BrandLogoComponent } from '../../core/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-pending-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, BrandLogoComponent],
  templateUrl: './pending-verification.component.html',
  styleUrls: ['./pending-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingVerificationComponent implements OnInit {
  private cisDataService = inject(CisDataService);

  searchId: string = 'SMITH/2025/52';
  selectedUser: any = null;

  ngOnInit(): void {
    // Initial state per v1.1 spec
  }

  // Functional "CALL RECORD" per User Guide
  callRecord(): void {
    console.log(`[RPR-KONTROL] LOADING PROFILE: ${this.searchId}`);
    // Simulate lookup logic based on spec data
    this.selectedUser = {
      fullName: 'JONATHAN QUINTON SMITH',
      idNumber: 'SMITH/2025/52',
      address: '123 Financial District, Sydney, NSW 2000 AU',
      abn: '12 345 678 901',
      entityType: 'BUSINESS / TRUST',
      bankName: 'CBA AU (Commonwealth Bank)',
      accountType: 'Business Checking'
    };
  }

  generateCIS(): void {
    console.log('[RPR-KONTROL] GENERATING CIS PDF REPORT');
  }
}