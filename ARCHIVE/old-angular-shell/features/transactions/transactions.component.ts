// transactions.component.ts
// Location: src/app/features/transactions/transactions.component.ts
// Transaction Ledger Component

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transactions-container">
      <h2>Transaction Ledger</h2>
      <p>Display transaction history and reconciliation data here.</p>
      <table class="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Reference</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-12-23</td>
            <td>TXN-001</td>
            <td>Debit</td>
            <td>$1,500.00</td>
            <td>Completed</td>
          </tr>
          <tr>
            <td>2025-12-22</td>
            <td>TXN-002</td>
            <td>Credit</td>
            <td>$2,250.00</td>
            <td>Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 20px;
      color: #fff;
    }
    
    h2 {
      margin-top: 0;
      color: #00a080;
    }
    
    .transaction-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    .transaction-table th,
    .transaction-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .transaction-table th {
      background-color: rgba(0, 128, 128, 0.2);
      font-weight: 600;
      color: #00c9b7;
    }
    
    .transaction-table tr:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  `]
})
export class TransactionsComponent {}
