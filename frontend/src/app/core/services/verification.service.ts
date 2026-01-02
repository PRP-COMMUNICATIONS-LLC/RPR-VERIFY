import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface VisionScanResult {
  success: boolean;
  status: string;
  driveFileId: string;
  reportId: string;
  adminEmail: string;
  declaredMetadata: {
    amount: number;
    date: string;
    accountNumber: string;
    institution: string;
  };
  extractedMetadata: {
    amount: number;
    date: string;
    accountNumber: string;
    institution: string;
    referenceId: string;
  };
  matchScore: number;
  riskMarker: number;
  mismatches: string[];
  error?: string;
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

export interface VerificationReport {
  reportId: string;
  caseId: string;
  status: string;
  forensic_metadata: {
    extracted_by: string;
    model_version: string;
    region: string;
    safety_threshold: string;
    timestamp: string;
  };
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

  verifyDocument(file: File): Observable<VerificationReport> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<VerificationReport>('/api/reports/verification', formData);
  }
}
