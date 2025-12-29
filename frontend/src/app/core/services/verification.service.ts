import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VerificationReport {
  status: string;
  report_url: string;
  hash: string;
}

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private readonly API_URL = `${environment.apiUrl}/api/reports/verification`;
  
  // ID Genesis Signal
  currentReportId = signal<string | null>(null);
  
  // State Management: Peacetime vs Wartime
  escalationLevel = signal<number>(0); 
  systemColor = computed(() => this.escalationLevel() > 1 ? '#FF0000' : '#00E0FF');

  constructor(private http: HttpClient) {}

  async generateForensicDossier(type: 'VERIFIED' | 'FLAGGED'): Promise<VerificationReport> {
    const reportId = this.currentReportId();
    if (!reportId) throw new Error("ID Genesis Event Missing");

    const payload = { reportId, reportType: type };
    
    try {
      const response = await lastValueFrom(
        this.http.post<VerificationReport>(this.API_URL, payload)
      );
      return response;
    } catch (error) {
      this.escalationLevel.set(2); // Trigger Wartime State on Failure
      throw error;
    }
  }
}

