import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface SentinelTrigger {
  id: string;
  name: string;
  narrative: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ForensicMetadata {
  extracted_by: string;
  region: string;
  timestamp: string;
  model_version: string;
  safety_threshold: string;
}

export interface ForensicResponse {
  status: string;
  case_id: string;
  forensic_metadata: ForensicMetadata;
  data: Record<string, unknown>; // Data structure depends on document type
}

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);

  // Endpoint locked to Singapore Node per Sovereign Constitution v12.4
  private readonly API_URL = 'https://asia-southeast1-rpr-verify-b.cloudfunctions.net/cisReportApi';

  getForensicMetadata(caseId: string): Observable<ForensicMetadata> {
    return new Observable(subscriber => {
      const docRef = doc(this.firestore, `cases/${caseId}/forensic_metadata/current`);
      return onSnapshot(docRef, (snapshot) => {
        subscriber.next(snapshot.data() as ForensicMetadata);
      });
    });
  }

  /**
   * Processes document through Vertex AI via the Singapore Node
   * @param file The document image (File object from DOM)
   * @param caseId Unique identifier for forensic audit trail
   */
  processDocument(file: File, caseId: string): Observable<ForensicResponse> {
    const formData = new FormData();
    formData.append('document_image', file);
    formData.append('case_id', caseId);

    return this.http.post<ForensicResponse>(this.API_URL, formData);
  }
}
