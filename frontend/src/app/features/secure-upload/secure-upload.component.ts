import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-secure-upload',
  template: `
    <div class="flex justify-center items-center h-screen">
      <div class="max-w-2xl w-full">
        <div 
          class="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center transition-colors hover:border-green-500 cursor-pointer"
          (click)="simulateUpload()"
        >
          @if (isUploading()) {
            <div class="flex justify-center items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          } @else if (isSuccess()) {
            <div class="text-green-500">✓ Encrypted & Synced to Local Engine (Google Drive)</div>
          } @else {
            <p class="text-slate-400">Drop files here or click to select</p>
          }
        </div>
        <div class="text-center mt-6">
          <button 
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            (click)="simulateUpload()"
          >
            Simulate Secure Upload
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecureUploadComponent {
  isUploading = signal(false);
  isSuccess = signal(false);

  simulateUpload() {
    this.isUploading.set(true);
    this.isSuccess.set(false);

    setTimeout(() => {
      this.isUploading.set(false);
      this.isSuccess.set(true);
    }, 2000);
  }
}
