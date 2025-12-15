import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CisReportResponse {
  status: string;
  case_id?: string;
  summary_text?: string;
  html_content?: string;
  sections?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get authorization headers with Firebase ID token
   */
  private getAuthHeaders(): HttpHeaders | undefined {
    const idToken = sessionStorage.getItem('firebaseIdToken');
    if (!idToken) {
      console.warn('⚠️ No Firebase ID token found in sessionStorage');
      return undefined;
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${idToken}`
    });
  }

  getCisReport(caseId: string): Observable<CisReportResponse> {
    console.log('🔵 ReportService.getCisReport() called');
    console.log('🔵 Case ID:', caseId);
    console.log('🔵 API URL:', `${this.apiUrl}/api/reports/cis/${caseId}`);

    const url = `${this.apiUrl}/api/reports/cis/${caseId}`;
    const headers = this.getAuthHeaders();
    
    return this.http.get<CisReportResponse>(url, headers ? { headers } : {});
  }

  downloadCisReportPdf(caseId: string): Observable<Blob> {
    console.log('🔵 ReportService.downloadCisReportPdf() called for case:', caseId);
    const url = `${this.apiUrl}/api/reports/cis/${caseId}?format=pdf`;

    const authHeaders = this.getAuthHeaders();
    const headers = authHeaders 
      ? authHeaders.set('Accept', 'application/pdf')
      : new HttpHeaders({ 'Accept': 'application/pdf' });

    return this.http.get(url, {
      responseType: 'blob',
      headers
    });
  }
}

