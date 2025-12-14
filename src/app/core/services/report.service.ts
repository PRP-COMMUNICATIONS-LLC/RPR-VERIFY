import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CisReportResponse {
  status: string;
  case_id?: string;
  summary_text?: string;  // Made optional for compatibility
  html_content?: string;  // Added for compatibility
  sections?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCisReport(caseId: string): Observable<CisReportResponse> {
    console.log('🔵 ReportService.getCisReport() called');
    console.log('🔵 Case ID:', caseId);
    console.log('🔵 API URL:', `${this.apiUrl}/api/reports/cis/${caseId}`);

    const url = `${this.apiUrl}/api/reports/cis/${caseId}`;
    return this.http.get<CisReportResponse>(url);
  }

  downloadCisReportPdf(caseId: string): Observable<Blob> {
    console.log('🔵 ReportService.downloadCisReportPdf() called for case:', caseId);
    const url = `${this.apiUrl}/api/reports/cis/${caseId}?format=pdf`;

    return this.http.get(url, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }
}

