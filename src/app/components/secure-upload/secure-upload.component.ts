import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EscalationService } from '../../services/escalation.service';

@Component({
  selector: 'app-secure-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 class="text-2xl font-bold text-gray-900">Secure Document Upload</h2>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">RPR Job ID</label>
        <input type="text" [(ngModel)]="reportId" placeholder="e.g. RPR-2025-TEST-99" class="w-full p-2 border rounded">
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">SR-ID</label>
        <input type="text" [(ngModel)]="srId" placeholder="e.g. SR-999999" class="w-full p-2 border rounded">
      </div>

      <div class="flex space-x-4">
        <button (click)="createJobFolder()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          Create RPR Job & Folder
        </button>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Select File</label>
        <input type="file" (change)="onFileSelected($event)" class="w-full p-2 border rounded bg-gray-50">
      </div>

      <button (click)="uploadBankSlip()" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full font-bold">
        Upload Bank Slip
      </button>

      <div *ngIf="currentFolderId" class="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
        <p class="font-semibold">✓ Folder Active</p>
        <p class="text-xs break-all">Drive Folder ID: {{ currentFolderId }}</p>
      </div>
    </div>
  `
})
export class SecureUploadComponent {
  private escalationService = inject(EscalationService);
  
  reportId = 'RPR-2025-TEST-99';
  srId = 'SR-999999';
  selectedFile: File | null = null;
  currentFolderId: string | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createJobFolder() {
    if (!this.reportId) {
      alert('Please enter a Report ID');
      return;
    }
    this.escalationService.createJobFolder(this.reportId).subscribe({
      next: (result) => {
        this.currentFolderId = result.folderId;
        console.log('Folder created:', result);
        alert(`Success: Drive Folder ID: ${result.folderId}`);
      },
      error: (error) => {
        console.error('Folder creation failed:', error);
        alert('Folder creation failed. Check console.');
      }
    });
  }

  uploadBankSlip() {
    if (!this.selectedFile) {
      alert('Please select a file first');
      return;
    }
    if (!this.currentFolderId) {
      alert('Must create job folder first');
      return;
    }
    
    this.escalationService.uploadDocument(
      this.reportId,
      this.selectedFile
    ).subscribe({
      next: (result) => {
        console.log('Upload success:', result);
        alert(`Success: File uploaded! Drive File ID: ${result.fileId}`);
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert('Upload failed. Check console.');
      }
    });
  }
}
