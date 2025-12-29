import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EscalationService } from '../../services/escalation.service';

@Component({
  selector: 'app-secure-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secure-upload.html',
  styles: [], // No external CSS
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecureUploadComponent {
  private escalationService = inject(EscalationService);
  private route = inject(ActivatedRoute);
  
  isUploading = signal(false);
  isSuccess = signal(false);
  reportId: string | null = null;

  ngOnInit() {
    this.reportId = this.route.snapshot.paramMap.get('reportId');
  }

  simulateUpload() {
    this.isUploading.set(true);
    this.isSuccess.set(false);

    // Simulate backend interaction
    setTimeout(() => {
      this.isUploading.set(false);
      this.isSuccess.set(true);
    }, 2000);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.isUploading.set(true);
      this.isSuccess.set(false);

      const reportId = this.reportId;
      if (!reportId) {
        console.error('Report ID is missing');
        this.isUploading.set(false);
        return;
      }

      this.escalationService.uploadDocument(reportId, file).subscribe({
        next: (res) => {
          if (res.success) {
            this.isUploading.set(false);
            this.isSuccess.set(true);
          } else {
            this.isUploading.set(false);
            this.isSuccess.set(false);
          }
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploading.set(false);
          this.isSuccess.set(false);
        }
      });
    }
  }
}
