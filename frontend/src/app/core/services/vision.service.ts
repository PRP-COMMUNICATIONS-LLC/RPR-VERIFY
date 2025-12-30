import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuditResponse {
  success: boolean;
  status: string;
  extractedMetadata?: any;
  risk_score?: number;
  mismatches?: number;
  error?: string;
  details?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisionService {

  private readonly auditUrl = `${environment.apiUrl}/api/reports/verification`;

  constructor(private http: HttpClient) { }

  auditImage(base64Image: string, reportId: string): Observable<AuditResponse> {
    const file_bytes = base64Image.split(',')[1];
    const mime_type = base64Image.split(',')[0].split(':')[1].split(';')[0];

    // The backend expects a specific payload structure.
    // Based on my previous work with `cis_generator.py` and `flask_app.py`,
    // it requires `reportId`.
    const payload = {
      reportId: reportId,
      file_bytes: file_bytes,
      mime_type: mime_type
    };

    return this.http.post<AuditResponse>(this.auditUrl, payload);
  }
}