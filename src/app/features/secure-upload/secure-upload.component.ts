import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  
  isUploading = signal(false);
  isSuccess = signal(false);

  simulateUpload() {
    this.isUploading.set(true);
    this.isSuccess.set(false);

    // Simulate backend interaction
    setTimeout(() => {
      this.isUploading.set(false);
      this.isSuccess.set(true);
    }, 2000);
  }
}
