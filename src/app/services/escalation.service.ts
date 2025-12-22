import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, collectionData, query, where } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface EscalationState {
  reportId: string;
  clientUid?: string;
  status: 'PENDING' | 'VERIFIED' | 'ESCALATED' | 'RESOLVED' | 'ACTIVE';
  riskScore?: number;
  extractedMetadata?: any;
  timestamp?: string;
  escalationLevel?: number;
  lastCheckTimestamp?: string;
  routeTarget?: string;
  notificationsSent?: string[];
}

export interface ForensicResult {
  success: boolean;
  data?: any;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EscalationService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);
  private http = inject(HttpClient); // Inject HttpClient

  /**
   * Creates a new escalation job in Firestore
   */
  createJob(reportId: string, metadata: any): Observable<void> {
    const user = this.auth.currentUser();
    if (!user) return new Observable(observer => observer.error('Unauthorized'));

    const docRef = doc(this.firestore, 'escalations', reportId);
    const payload: EscalationState = {
      reportId,
      clientUid: user.uid,
      status: 'PENDING',
      riskScore: 0,
      extractedMetadata: metadata,
      timestamp: new Date().toISOString()
    };

    return from(setDoc(docRef, payload));
  }

  /**
   * Retrieves specific job status
   */
  getStatus(reportId: string): Observable<EscalationState | null> {
    const docRef = doc(this.firestore, 'escalations', reportId);
    return from(getDoc(docRef)).pipe(
      map(snap => snap.exists() ? snap.data() as EscalationState : null)
    );
  }

  /**
   * Retrieves all escalations for the current user
   */
  getEscalations(): Observable<EscalationState[]> {
    const user = this.auth.currentUser();
    if (!user) return of([]);

    const colRef = collection(this.firestore, 'escalations');
    const q = query(colRef, where('clientUid', '==', user.uid));
    
    return collectionData(q, { idField: 'reportId' }) as Observable<EscalationState[]>;
  }

  /**
   * Computes dashboard statistics (Mock logic for Phase 4)
   */
  getStats(): Observable<any> {
    // In a real app, this might be an aggregation query or a separate stats document
    return of({
      activeAudits: 3,
      riskLevel: 'MEDIUM',
      systemHealth: 98.4
    });
  }

  // --- MOVED INSIDE CLASS ---

  trigger(reportId: string, metadata: any): Observable<any> {
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
