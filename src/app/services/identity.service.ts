/* src/app/services/identity.service.ts */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserProfile {
  name: string;
  uid: string;
  ipNode: string;
  clearance: string;
}

@Injectable({ providedIn: 'root' })
export class IdentityService {
  private userSource = new BehaviorSubject<UserProfile>({
    name: 'ALEXANDER VANCE',
    uid: 'USR-992-00X',
    ipNode: '192.168.1.104',
    clearance: 'LEVEL_04_PROACTIVE'
  });

  user$ = this.userSource.asObservable();
}
