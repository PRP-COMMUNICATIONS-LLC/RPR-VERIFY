import { Injectable, inject } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  // Required to resolve TS2339 in app.component.ts
  systemColor(): string {
    return '#00E0FF';
  }

  getForensicMetadata(caseId: string): Observable<ForensicMetadata> {
    return new Observable(subscriber => {
      const docRef = doc(this.firestore, `cases/${caseId}/forensic_metadata/current`);
      return onSnapshot(docRef, (snapshot) => {
        subscriber.next(snapshot.data() as ForensicMetadata);
      });
    });
  }
}
