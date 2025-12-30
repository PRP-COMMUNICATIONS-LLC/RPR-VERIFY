
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UploadedFile = {
  id: string;
  name: string;
  status: 'Processing' | 'Synced' | 'Failed';
  progress: number;
};

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
  files = signal<UploadedFile[]>([]);

  private createUploadId(): string {
    // Use a real UUID when available; fall back to a reasonably unique ID.
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return (crypto as Crypto).randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const file = input.files[0];
    // Allow selecting the same file again (browser won't fire change if value is unchanged).
    input.value = '';

    const uploadId = this.createUploadId();
    const newFile: UploadedFile = {
      id: uploadId,
      name: file.name,
      status: 'Processing',
      progress: 0,
    };

    this.files.update(files => [newFile, ...files]);

    const interval = setInterval(() => {
      this.files.update(files =>
        files.map(f => {
          if (f.id === uploadId && f.progress < 100) {
            return { ...f, progress: Math.min(100, f.progress + 10) };
          }
          return f;
        })
      );

      if (this.files().find(f => f.id === uploadId)?.progress === 100) {
        clearInterval(interval);
        this.files.update(files =>
          files.map(f =>
            f.id === uploadId ? { ...f, status: 'Synced' } : f
          )
        );
      }
    }, 200);
  }

  triggerFileInput(): void {
    document.getElementById('file-upload')?.click();
  }
}
