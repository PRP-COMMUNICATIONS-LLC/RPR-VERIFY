import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EscalationState } from '../models/escalation';

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

  /**
   * Get escalation status for a report (stub for dashboard)
   */
  getStatus(reportId: string): Observable<EscalationState> {
    console.log('Stub: Getting escalation status for report', reportId);
    return of({
      reportId,
      escalationLevel: 1,
      status: 'ACTIVE',
      lastCheckTimestamp: new Date().toISOString(),
      routeTarget: '/dashboard',
      notificationsSent: [],
      resolutionNote: undefined,
      actionTaken: undefined
    });
  }

  /**
   * Resolve an escalation (stub for dashboard)
   */
  resolve(reportId: string, resolutionNote: string): Observable<EscalationState> {
    console.log('Stub: Resolving escalation for report', reportId, 'with note:', resolutionNote);
    return of({
      reportId,
      escalationLevel: 0,
      status: 'RESOLVED',
      lastCheckTimestamp: new Date().toISOString(),
      routeTarget: '/dashboard',
      notificationsSent: [],
      resolutionNote,
      actionTaken: 'Resolved via dashboard UI'
    });
  }
}
