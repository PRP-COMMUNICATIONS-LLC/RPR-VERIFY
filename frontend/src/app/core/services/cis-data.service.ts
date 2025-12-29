import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CustomerRecord {
  id: string;
  customerId: string;
  name: string; // Restored
  bank: string;
  type: string;
  date: string;
  amt: number;
}

@Injectable({ providedIn: 'root' })
export class CisDataService {
  private ledgerData: CustomerRecord[] = [
    { id: '1', customerId: 'SMITH/2025/52', name: 'Jonathan Quinton Smith', bank: 'CBA AU', type: 'OSKO', date: '2025-12-17', amt: 15450.00 },
    { id: '2', customerId: 'USR/2025/53', name: 'Marcus Holloway', bank: 'Westpac Business', type: 'NPP-FAST', date: '2025-12-18', amt: 1250.50 },
    { id: '3', customerId: 'USR/2025/54', name: 'Elena Rodriguez', bank: 'NAB Node', type: 'OSKO', date: '2025-12-15', amt: 3200.75 }
  ];

  getLedger(): Observable<CustomerRecord[]> {
    return of(this.ledgerData);
  }
}