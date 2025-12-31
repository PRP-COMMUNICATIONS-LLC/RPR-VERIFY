import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface EscalationState {
  reportId: string;
  clientUid?: string;
  status: 'PENDING' | 'VERIFIED' | 'ESCALATED' | 'RESOLVED' | 'ACTIVE';
  riskScore?: number;
  extractedMetadata?: Record<string, unknown>;
  timestamp?: string;
  escalationLevel?: number;
  lastCheckTimestamp?: string;
  routeTarget?: string;
  notificationsSent?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EscalationService {
  
  /**
   * Retrieves dashboard statistics
   * Returns Observable with total, pending, and resolved counts
   */
  getStats(): Observable<{
    total: number;
    pending: number;
    resolved: number;
    activeAudits?: number;
    riskLevel?: string;
    systemHealth?: number;
  }> {
    // Mock implementation - replace with actual data source
    return of({
      total: 0,
      pending: 0,
      resolved: 0,
      activeAudits: 0,
      riskLevel: 'LOW',
      systemHealth: 100
    });
  }

  /**
   * Retrieves all escalations
   * Returns Observable array of EscalationState
   */
  getEscalations(): Observable<EscalationState[]> {
    // Mock implementation - replace with actual data source
    return of([]);
  }

  /**
   * Retrieves specific job status
   * Kept for backward compatibility
   */
  getStatus(reportId: string): Observable<EscalationState | null> {
    console.log('reportId', reportId);
    return of(null);
  }
}