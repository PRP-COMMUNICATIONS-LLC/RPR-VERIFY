import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// ✅ Defined Interfaces to fix "Object is of type unknown" errors
export interface CreateJobFolderResponse {
  folderId: string;
  status: string;
  path: string;
}

export interface UploadDocumentResponse {
  fileId: string;
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EscalationService {

  constructor() {}

  /**
   * Mock implementation of creating a job folder
   * Returns an Observable to match standard Angular component patterns (.subscribe)
   */
  createJobFolder(reportId: string): Observable<CreateJobFolderResponse> {
    console.log('Stub: Creating folder for report', reportId);
    return of({
      folderId: 'stub-folder-' + reportId,
      status: 'created',
      path: '/RPR-JOBS/STUB'
    });
  }

  /**
   * Mock implementation of document upload
   */
  uploadDocument(reportId: string, file: File): Observable<UploadDocumentResponse> {
    console.log('Stub: Uploading file', file.name);
    return of({
      fileId: 'stub-file-' + Date.now(),
      success: true,
      message: 'File uploaded successfully'
    });
  }
}
