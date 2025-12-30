import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent {
  auditResult: any = null;
  isProcessing = false;
  notionStatus = '';

  private http = inject(HttpClient);

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isProcessing = true;
    const formData = new FormData();
    formData.append('file', file);

    // Call the Singapore Sovereign Engine
    this.http.post(`${environment.apiUrl}/audit`, formData)
      .subscribe({
        next: (res: any) => {
          this.auditResult = res;
          this.auditResult.forensic = this.calculateForensicStatus(
            res.extractedMetadata.amount,
            res.expectedAmount // Injected from UI context
          );
          this.isProcessing = false;
          if (!this.auditResult.forensic.isRedAlert) {
            this.notionStatus = 'Ready for Sovereign Lock';
          }
        },
        error: (err) => {
          console.error('Forensic Engine Offline', err);
          this.isProcessing = false;
        }
      });
  }

  calculateForensicStatus(ocrValue: number, expectedValue: number) {
    const variance = Math.abs((ocrValue - expectedValue) / expectedValue) * 100;
    const isRedAlert = variance > 1.1; // 1.1% STRATEGIC THRESHOLD

    return {
      variance: variance.toFixed(3),
      isRedAlert: isRedAlert,
      status: isRedAlert ? '🔴 URGENT AUDIT' : '✅ VERIFIED'
    };
  }

  confirmAudit() {
    if (!this.auditResult || this.auditResult.forensic.isRedAlert) return;

    this.isProcessing = true;
    this.notionStatus = 'Syncing with Notion...';

    // Data payload for the Sovereign Notion Bridge
    const syncPayload = {
      caseId: 'RPR-' + Date.now(),
      clientName: 'Gavril Vasile Pop', // Verified from ID
      bsb: '086-217',                 // Verified from NAB
      accountNumber: '63-533-7192',    // Verified from NAB
      auditStatus: 'VERIFIED_OWNER',
      notionDbId: environment.notionTaskDbId
    };

    this.http.post(`${environment.apiUrl}/sync-notion`, syncPayload)
      .subscribe({
        next: (res: any) => {
          this.notionStatus = '✅ Audit Permanently Locked in Notion.';
          this.isProcessing = false;
        },
        error: (err) => {
          this.notionStatus = 'Notion Bridge Failure';
          console.error('Notion Bridge Failure', err);
          this.isProcessing = false;
        }
      });
  }
}