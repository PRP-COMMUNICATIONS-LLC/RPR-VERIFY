import { Injectable, signal } from '@angular/core';

export interface Transaction {
  date: Date;
  ref: string;
  amount: number;
  status: 'SETTLED' | 'PENDING' | 'FLAGGED';
}

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private _transactions = signal<Transaction[]>([
    { date: new Date(), ref: 'TX-99021-V', amount: 14200.50, status: 'SETTLED' },
    { date: new Date(), ref: 'TX-99022-V', amount: 8900.00, status: 'PENDING' },
    { date: new Date(), ref: 'TX-99023-V', amount: 2100.25, status: 'FLAGGED' },
    { date: new Date(), ref: 'TX-99024-V', amount: 540.00, status: 'SETTLED' }
  ]);

  transactions = this._transactions.asReadonly();
}

