import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EscalationState, EscalationTriggerResponse } from '../models/escalation';
import { environment } from '../../environments/environment';

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

export interface ForensicResult {
  matchScore: number;
  riskMarker: 0 | 1 | 2 | 3;
  extractedMetadata: {
    amount: number;
    date: string;
    accountNumber: string;
    institution: string;
  };
  mismatches: any[];
}

@Injectable({
  providedIn: 'root'
})
export class EscalationService {
  private http = inject(HttpClient);

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
   * Get escalation status for a report
   */
  getStatus(reportId: string): Observable<EscalationState> {
    return this.http.get<EscalationState>(`${environment.apiUrl}/api/escalation/status/${reportId}`);
  }

  /**
   * Upload a slip and create an escalation
   */
  uploadSlip(reportId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/api/storage/upload/${reportId}`, formData);
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

  /**
   * Trigger an escalation (stub for dashboard)
   */
  trigger(reportId: string, metadata: any): Observable<EscalationTriggerResponse> {
    console.log('Stub: Triggering escalation for report', reportId, 'with metadata:', metadata);
    const state: EscalationState = {
      reportId,
      escalationLevel: 2,
      status: 'ACTIVE',
      lastCheckTimestamp: new Date().toISOString(),
      routeTarget: '/dashboard',
      notificationsSent: [],
    };
    return of({
      success: true,
      currentState: state,
      actionTaken: 'Escalation triggered manually'
    });
  }

  /**
   * Scan a bank slip using the backend vision engine
   */
  scanSlip(payload: { 
    driveFileId: string; 
    reportId: string; 
    declaredMetadata: any; 
    fileBytes: string; // base64 string from UI
  }): Observable<ForensicResult> {
    return this.http.post<ForensicResult>(
      '/api/v1/slips/scan', 
      payload
    );
  }

  /**
   * Wrapper for scanSlip to be used by components
   */
  runScan(reportId: string, payload: any): Observable<ForensicResult> {
    return this.scanSlip(payload);
  }
}
