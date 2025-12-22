import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  // State Signals
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  uploadProgress = signal(0);
  uploadStatus = signal<'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
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
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile.set(event.dataTransfer.files[0]);
      this.uploadStatus.set('IDLE');
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  async startSecureUpload() {
    if (!this.selectedFile()) return;

    this.isUploading.set(true);
    this.uploadStatus.set('UPLOADING');
    this.uploadProgress.set(0);

    // Simulate Forensic Ingestion Pipeline
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      this.uploadProgress.set(i);
    }

    this.isUploading.set(false);
    this.uploadStatus.set('SUCCESS');
  }

  reset() {
    this.selectedFile.set(null);
    this.uploadStatus.set('IDLE');
    this.uploadProgress.set(0);
  }
}
