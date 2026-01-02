import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface VisionScanResult {
  success: boolean;
  status?: string;
  extractedMetadata?: {
    amount: number;
    date: string;
    accountNumber: string;
    institution: string;
    referenceId: string;
  };
  risk_level?: number;
  matchScore?: number;
  riskMarker?: number;
  error?: string;
  details?: string;
}

export interface SentinelTrigger {
  id: string;
  name: string;
  narrative: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ForensicMetadata {
  riskLevel: 'GREEN' | 'AMBER' | 'RED';
  forensicBrief: string;
  activeTriggers: SentinelTrigger[];
}

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);

  systemColor = signal<string>('#00E0FF'); // Default Sovereign Cyan

  getForensicMetadata(caseId: string): Observable<ForensicMetadata> {
    return new Observable(subscriber => {
      const docRef = doc(this.firestore, `cases/${caseId}/forensic_metadata/current`);
      return onSnapshot(docRef, (snapshot) => {
        subscriber.next(snapshot.data() as ForensicMetadata);
      });
    });
  }

  scanBankSlip(slipFile: File): Observable<VisionScanResult> {
    const formData = new FormData();
    formData.append('file', slipFile);

    // This endpoint should be proxied to the hardened Singapore backend.
    const endpoint = '/api/vision/scan';

    return this.http.post<VisionScanResult>(endpoint, formData);
  }
}
