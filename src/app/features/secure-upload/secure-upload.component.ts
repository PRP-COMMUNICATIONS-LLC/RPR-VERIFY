import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EscalationService } from '../../services/escalation.service';

@Component({
  selector: 'app-secure-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secure-upload.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecureUploadComponent {
  private escalationService = inject(EscalationService);
  private route = inject(ActivatedRoute);
  
  isUploading = signal(false);
  isSuccess = signal(false);
  isVeritasVerified = signal(false); // New: Veritas Logic Check

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const reportId = this.route.snapshot.paramMap.get('reportId');

      if (!reportId) return;

      this.isUploading.set(true);

      // Execute Evidence Seal Handshake
      this.escalationService.uploadDocument(reportId, file).subscribe({
        next: (res) => {
          this.isUploading.set(false);
          this.isSuccess.set(res.success);
          this.isVeritasVerified.set(res.veritasStatus === 'pass');
        },
        error: () => {
          this.isUploading.set(false);
          this.isSuccess.set(false);
        }
      });
    }
  }
}
