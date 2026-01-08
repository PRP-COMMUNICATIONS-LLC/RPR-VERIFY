import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable, fromEvent, switchMap, map, retry, timer, catchError, throwError, MonoTypeOperatorFunction } from 'rxjs';

export interface SentinelTrigger {
  id: string;
  name: string;
  narrative: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ForensicMetadata {
  case_id: string; // ADDED: Matches backend injection for Step 3 traceability
  extracted_by: string;
  region: string;
  timestamp: string;
  model_version: string;
  safety_threshold: string;
}

export interface IdentityData {
  fullName?: string;
  idNumber?: string;
}

export interface AddressData {
  street?: string;
  postalCode?: string;
  country?: string;
}

export interface EntityData {
  type?: string;
  abn?: string;
  status?: string;
}

export interface BankData {
  bankName?: string;
  accountType?: string;
  branch?: string;
}

export interface ForensicData {
  identity?: IdentityData;
  address?: AddressData;
  entity?: EntityData;
  bank?: BankData;
}

export interface ForensicResponse {
  status: string;
  case_id: string;
  risk_status: string;
  forensic_metadata: ForensicMetadata;
  data: ForensicData;
}

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);

  // Signal to track system health and risk status
  public systemStatus = signal<'NORMAL' | 'AMBER' | 'RED'>('NORMAL');
  
  // Signal to track manual escalation state (for ResolutionComponent)
  private _isEscalated = signal(false);
  public readonly isEscalated = this._isEscalated.asReadonly();

  /**
   * Maps backend risk status to UI-bound signals
   * @param backendRisk The risk_status returned from the forensic engine
   */
  updateSystemStatus(backendRisk: string) {
    if (backendRisk === 'GREEN') this.systemStatus.set('NORMAL');
    else if (backendRisk === 'AMBER') this.systemStatus.set('AMBER');
    else if (backendRisk === 'RED') this.systemStatus.set('RED');
  }
  
  /**
   * Trigger manual escalation (Red-Alert activation)
   * Used by ResolutionComponent for dispute escalation
   */
  triggerAlert(): void {
    console.warn("🚨 Sovereign Red-Alert Activated");
    this._isEscalated.set(true);
    this.systemStatus.set('RED');
  }
  
  /**
   * Reset manual escalation (return to proactive state)
   * Used by ResolutionComponent to reset alert state
   */
  resetAlert(): void {
    console.log("✅ Sovereign Red-Alert Reset: Returning to Proactive state");
    this._isEscalated.set(false);
    // Reset to NORMAL unless backend indicates otherwise
    if (this.systemStatus() === 'RED') {
      this.systemStatus.set('NORMAL');
    }
  }

  // Returns hex codes based on Sovereign Constitution risk markers
  public systemColor() {
    // If manually escalated, always return red
    if (this._isEscalated()) return '#FF0000';
    
    const status = this.systemStatus();
    if (status === 'RED') return '#FF0000';   // High Risk / Critical Failure
    if (status === 'AMBER') return '#FFBF00'; // Discrepancy / Warning
    return '#00FFFF';                         // Default to Cyan for NORMAL state
  }

  // Live Singapore Production Node - Cloud Run Backend
  private readonly API_URL = 'https://rpr-verify-backend-794095666194.asia-southeast1.run.app';
  private readonly IDENTITY_EXTRACTION_URL = 'https://rpr-verify-backend-794095666194.asia-southeast1.run.app/extractIdentity';

  /**
   * Creates a retry operator with exponential backoff for handling Cloud Run cold starts
   * @param maxRetries Maximum number of retry attempts (default: 3)
   * @returns RxJS operator for retry logic with proper type safety
   */
  private createRetryOperator<T>(maxRetries = 3): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => source.pipe(
      retry({
        count: maxRetries,
        delay: (error: unknown, retryCount: number) => {
          // Don't retry on 4xx errors (client errors)
          const httpError = error as { status?: number };
          if (httpError?.status && httpError.status >= 400 && httpError.status < 500) {
            return throwError(() => error);
          }
          // Exponential backoff: 1s, 2s, 3s
          const delayMs = retryCount * 1000;
          console.log(`[VERIFICATION SERVICE] Retry ${retryCount}/${maxRetries} after ${delayMs}ms`);
          return timer(delayMs);
        }
      })
    );
  }

  /**
   * Extracts identity (firstName, lastName, and document ID) from a document for zero-touch project initialization
   * Refactored to use RxJS streams for clean retry logic
   * @param file The document image (File object from DOM)
   * @returns Observable with extracted firstName, lastName, and idNumber
   */
  extractIdentity(file: File): Observable<{ firstName: string; lastName: string; idNumber: string }> {
    const reader = new FileReader();
    
    // Create observable from FileReader load event
    const fileRead$ = fromEvent(reader, 'load').pipe(
      map(() => {
        const result = reader.result as string;
        return result.split(',')[1]; // Extract base64 string
      })
    );
    
    // Start reading the file
    reader.readAsDataURL(file);
    
    // Chain: File Read -> HTTP Post -> Retry -> Error Handling
    interface IdentityData {
      firstName: string;
      lastName: string;
      idNumber: string;
    }
    return fileRead$.pipe(
      switchMap(base64String => 
        this.http.post<IdentityData>(
          this.IDENTITY_EXTRACTION_URL,
          { image: base64String }
        )
      ),
      this.createRetryOperator<IdentityData>(3), // Fixed Type Safety - Exponential backoff handles the 10s cold start
      catchError((error) => {
        console.error('[VERIFICATION SERVICE] Identity extraction failed after retries:', error);
        return throwError(() => new Error('Failed to extract identity. The service may be starting up. Please try again.'));
      })
    );
  }

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

    return this.http.post<ForensicResponse>(this.API_URL, formData).pipe(
      this.createRetryOperator<ForensicResponse>(3), // Fixed Type Safety
      catchError((error: any) => {
        const errorCode = error.error?.errorCode;
        console.error(`[VERIFICATION SERVICE] Document processing failed with error code: ${errorCode}`, error);

        switch (errorCode) {
          case 'RateLimitError':
            this.systemStatus.set('AMBER');
            break;
          case 'ValidationError':
          case 'ForensicMetadataError':
            this.systemStatus.set('RED');
            break;
          default:
            this.systemStatus.set('RED'); // Default to RED for any other server-side failure
        }

        return throwError(() => new Error(`Processing failed: ${errorCode || 'Unknown Error'}`));
      })
    );
  }
}
