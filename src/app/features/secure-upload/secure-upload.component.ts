import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EscalationService, ForensicMetadata } from '../../services/escalation.service';
import { firstValueFrom } from 'rxjs';

interface UploadMetadata {
  caseId: string;
  analystId: string;
  documentType: 'BANK_SLIP' | 'ID_CARD' | 'CONTRACT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

@Component({
  selector: 'app-secure-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './secure-upload.html',
  styleUrls: ['./secure-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecureUploadComponent {
  private escalationService = inject(EscalationService);

  // State Signals
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  uploadProgress = signal(0);
  uploadStatus = signal<'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  scanResult = signal<any>(null);
  errorMessage = signal<string | null>(null);
  
  metadata = signal<UploadMetadata>({
    caseId: 'RPR-' + Math.floor(1000 + Math.random() * 9000),
    analystId: 'AN-001',
    documentType: 'BANK_SLIP',
    priority: 'MEDIUM'
  });

  // Computed
  canUpload = computed(() => this.selectedFile() !== null && !this.isUploading());
  fileSize = computed(() => {
    const file = this.selectedFile();
    if (!file) return '0 KB';
    const kb = file.size / 1024;
    return kb > 1024 ? (kb / 1024).toFixed(2) + ' MB' : kb.toFixed(2) + ' KB';
  });

  // HELPER: Updates metadata cleanly to avoid template parser errors
  updateMeta(field: keyof UploadMetadata, value: any) {
    this.metadata.update(current => ({
      ...current,
      [field]: value
    }));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      this.uploadStatus.set('IDLE');
      this.errorMessage.set(null);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile.set(event.dataTransfer.files[0]);
      this.uploadStatus.set('IDLE');
      this.errorMessage.set(null);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  async startSecureUpload() {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    this.uploadStatus.set('UPLOADING');
    this.uploadProgress.set(0);
    this.errorMessage.set(null);
    this.scanResult.set(null);

    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        const current = this.uploadProgress();
        if (current < 90) {
          this.uploadProgress.set(current + 10);
        }
      }, 200);

      // Prepare forensic metadata payload
      const forensicMetadata: ForensicMetadata = {
        caseId: this.metadata().caseId,
        analystId: this.metadata().analystId,
        documentType: this.metadata().documentType,
        priority: this.metadata().priority
      };

      // Call Vision Engine with file + metadata
      const result = await firstValueFrom(
        this.escalationService.scanSlipWithMetadata(
          file,
          forensicMetadata,
          this.metadata().caseId // Using caseId as reportId
        )
      );

      clearInterval(progressInterval);
      this.uploadProgress.set(100);

      if (result.success !== false && !result.error) {
        // Success - Vision Engine processed the document
        this.scanResult.set(result);
        this.uploadStatus.set('SUCCESS');
        
        // Log forensic results
        console.log('✅ Vision Engine Scan Complete:', {
          riskLevel: result.risk_level,
          matchScore: result.matchScore,
          riskMarker: result.riskMarker,
          extractedMetadata: result.extractedMetadata,
          mismatches: result.mismatches
        });
      } else {
        // Error from Vision Engine
        this.uploadStatus.set('ERROR');
        this.errorMessage.set(result.error || 'Vision Engine scan failed');
        console.error('❌ Vision Engine Error:', result.error);
      }
    } catch (error: any) {
      this.uploadStatus.set('ERROR');
      this.errorMessage.set(error.message || 'Failed to upload and scan document');
      console.error('❌ Upload Error:', error);
    } finally {
      this.isUploading.set(false);
    }
  }

  reset() {
    this.selectedFile.set(null);
    this.uploadStatus.set('IDLE');
    this.uploadProgress.set(0);
    this.scanResult.set(null);
    this.errorMessage.set(null);
    // Generate new case ID for next ingestion
    this.metadata.update(current => ({
      ...current,
      caseId: 'RPR-' + Math.floor(1000 + Math.random() * 9000)
    }));
  }
}
