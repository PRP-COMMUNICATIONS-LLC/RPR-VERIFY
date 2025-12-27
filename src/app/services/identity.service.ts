/* src/app/services/identity.service.ts */
import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  name: string;
  uid: string;
  ipNode: string;
  clearance: string;
}

@Injectable({ providedIn: 'root' })
export class IdentityService {
  // Existing UserProfile Logic
  private userSource = new BehaviorSubject<UserProfile>({
    name: 'ALEXANDER VANCE',
    uid: 'USR-992-00X',
    ipNode: '192.168.1.104',
    clearance: 'LEVEL_04_PROACTIVE'
  });
  user$ = this.userSource.asObservable();

  // The Sovereign State
  public isEscalated = signal<boolean>(false);

  // Sentinel Status mapping
  public sentinelStatus = computed(() =>
    this.isEscalated() ? 'CRITICAL_BREACH' : 'SYSTEM_STABLE'
  );

  public triggerAlert() {
    console.warn('🚨 SOVEREIGN RED-ALERT ACTIVATED');
    this.isEscalated.set(true);
  }

  public resetSystem() {
    this.isEscalated.set(false);
  }
}
