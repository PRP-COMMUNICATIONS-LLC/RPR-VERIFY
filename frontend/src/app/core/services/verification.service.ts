import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Trigger {
  id: string;
  narrative: string;
}

export interface ForensicMetadata {
  riskLevel: 'GREEN' | 'AMBER' | 'RED';
  forensicBrief: string;
  activeTriggers: Trigger[];
}

export interface VerificationReport {
  status: string;
  report_url: string;
  hash: string;
}

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);

  private readonly API_URL = `${environment.apiUrl}/api/reports/verification`;
  
  // ID Genesis Signal
  currentReportId = signal<string | null>(null);
  
  // State Management: Peacetime vs Wartime
  escalationLevel = signal<number>(0); 
  systemColor = computed(() => this.escalationLevel() > 1 ? '#FF0000' : '#00E0FF');

  getForensicMetadata(caseId: string): Observable<ForensicMetadata> {
    const docRef = doc(this.firestore, `cases/${caseId}/sentinel/forensic_metadata`);
    return new Observable(subscriber => {
      const unsubscribe = onSnapshot(docRef,
        (doc) => {
          if (doc.exists()) {
            subscriber.next(doc.data() as ForensicMetadata);
          } else {
            subscriber.next({
              riskLevel: 'GREEN',
              forensicBrief: 'No sentinel data available for this case.',
              activeTriggers: []
            });
          }
        },
        (error) => subscriber.error(error)
      );
      return () => unsubscribe();
    });
  }

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

