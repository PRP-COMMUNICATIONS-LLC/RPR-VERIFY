import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ScanRequest {
  driveFileId: string;
  reportId: string;
  declaredMetadata: {
    amount: number;
    date: string;
    accountNumber: string;
    institution: string;
  };
}

export interface ScanResult {
  status: 'success' | 'error';
  risk_level: number;
  escalationLevel?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  async triggerScan(request: ScanRequest): Promise<Observable<ScanResult>> {
    const idToken = await this.authService.getIdToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<ScanResult>(
      `${environment.apiUrl}/api/v1/slips/scan`,
      request,
      { headers }
    );
  }

  /**
   * Observable version for components that prefer RxJS flows.
   */
  triggerScan$(request: ScanRequest): Observable<ScanResult> {
    return from(this.authService.getIdToken()).pipe(
      switchMap(idToken => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        });
        return this.http.post<ScanResult>(
          `${environment.apiUrl}/api/v1/slips/scan`,
          request,
          { headers }
        );
      })
    );
  }

  async generateCIS(reportId: string, type: 'INDIVIDUAL' | 'BUSINESS') {
    const idToken = await this.authService.getIdToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${environment.apiUrl}/api/v1/reports/generate-cis`, {
      reportId, reportType: type
    }, { headers }).toPromise();
  }
}
