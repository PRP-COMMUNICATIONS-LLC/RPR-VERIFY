
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UploadedFile = {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const file = input.files[0];
    const newFile: UploadedFile = {
      name: file.name,
      status: 'Processing',
      progress: 0,
    };

    this.files.update(files => [newFile, ...files]);

    const interval = setInterval(() => {
      this.files.update(files =>
        files.map(f => {
          if (f.name === newFile.name && f.progress < 100) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        })
      );

      if (this.files().find(f => f.name === newFile.name)?.progress === 100) {
        clearInterval(interval);
        this.files.update(files =>
          files.map(f =>
            f.name === newFile.name ? { ...f, status: 'Synced' } : f
          )
        );
      }
    }, 200);
  }

  triggerFileInput(): void {
    document.getElementById('file-upload')?.click();
  }
}
