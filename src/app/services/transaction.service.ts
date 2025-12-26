import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface Transaction {
  time: string;
  id: string;
  entity: string;
  amount: number;
  week: string; // W51, W52, etc.
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private txData = new BehaviorSubject<Transaction[]>([
    { time: '2025-12-26 09:12', id: 'TX-882-1', entity: 'AMAZON WEB SVCS', amount: 1420.50, week: 'W52' },
    { time: '2025-12-26 14:45', id: 'TX-882-2', entity: 'STRIPE RECURRING', amount: 89.00, week: 'W52' },
    { time: '2025-12-18 11:20', id: 'TX-851-1', entity: 'GOOGLE CLOUD', amount: 2100.00, week: 'W51' }
  ]);

  getTransactionsByWeek(week: string) {
    return this.txData.pipe(
      map(txs => txs.filter(t => t.week === week))
    );
  }
}
