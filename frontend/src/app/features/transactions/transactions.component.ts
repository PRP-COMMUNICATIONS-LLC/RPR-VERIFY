import { Component, signal, computed } from '@angular/core';


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [],
  template: `
    <div style="width: 100%; background-color: transparent; min-height: 100vh;">

      <div style="padding: 40px; display: flex; flex-direction: column;">
        <div style="margin-left: 84px; display: flex; flex-direction: column;">
          <div style="display: block !important; visibility: visible !important; font-family: 'Inter'; font-weight: 500; font-size: 11px; letter-spacing: 0.1em; color: #666666; text-transform: uppercase; margin-bottom: 8px;">
            WEEKLY
          </div>

          <h1 style="font-family: 'Inter'; font-weight: 900; font-size: 60px; letter-spacing: -1.5px; color: #FFFFFF; text-transform: uppercase; margin: 0; line-height: 1;">
            TRANSACTIONS
          </h1>
        </div>

        <div style="margin-left: 84px; color: #999999; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 20px;">
          GLOBAL WEEKLY LEDGER & CROSS-USER BILLING SUMMARY
        </div>
      </div>

      <div style="padding: 0 40px 40px;">
        <section style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 0 30px rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; width: 100%;">

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="margin-left: 84px; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;">
                Reporting Period:
              </span>
              <select [value]="currentWeek()" (change)="onWeekChange($event)" style="background: #FFFFFF; border: none; color: #000000; font-family: 'Inter'; font-weight: 900; font-size: 10px; padding: 8px 16px; border-radius: 2px; text-transform: uppercase; cursor: pointer; outline: none;">
                <option value="WK-52">WEEK 52: DEC 22 - DEC 28</option>
                <option value="WK-51">WEEK 51: DEC 15 - DEC 21</option>
                <option value="WK-50">WEEK 50: DEC 08 - DEC 14</option>
              </select>
            </div>

            <div style="display: flex; gap: 16px;">
              <button (click)="exportCSV()" style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">
                Export CSV
              </button>
              <button (click)="generateReport()" style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">
                Generate Report
              </button>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
            <thead>
              <tr style="background: #1A1A1A; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.2);">
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900;">WEEK NO</th>
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900;">USER ID</th>
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900;">BANK</th>
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900;">ACCOUNT NO</th>
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900;">TYPE</th>
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900;">DATE</th>
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900;">STATUS</th>
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900; text-align: right;">TOTAL (AUD)</th>
              </tr>
            </thead>
            <tbody>
              @for (row of globalLedger.slice(0, 10); track row) {
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03); color: #ffffff;">
                  <td style="padding: 20px;">{{ row.week }}</td>
                  <td style="padding: 20px; font-family: monospace; opacity: 0.6;">{{ row.userId }}</td>
                  <td style="padding: 20px;">{{ row.bank }}</td>
                  <td style="padding: 20px; opacity: 0.5;">{{ row.accNo }}</td>
                  <td style="padding: 20px;">{{ row.type }}</td>
                  <td style="padding: 20px;">{{ row.date }}</td>
                  <td style="padding: 20px; font-weight: 700;">
                    {{ row.clearance ? 'VERIFIED' : 'PENDING' }}
                  </td>
                  <td style="padding: 20px; font-weight: 900; text-align: right;">
                    $ {{ row.amount.toLocaleString() }}
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr style="background: rgba(255, 255, 255, 0.05);">
                <td colspan="7" style="padding: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #ffffff;">
                  {{ currentWeek() }} TOTAL BILLING
                </td>
                <td style="padding: 24px; text-align: right; font-size: 16px; font-weight: 900; color: #ffffff; border-top: 2px solid #ffffff;">
                  $ {{ totalBilling() }} AUD
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    </div>
    `
})
export class TransactionsComponent {
  currentWeek = signal('WK-52');

  // Multi-Tenant Dataset (Contains more than 10 rows for verification)
  globalLedger = [
    { week: 'WK-52', userId: 'SMITH/2025/WK52', bank: 'CBA AU', accNo: '**** 4290', type: 'OSKO', date: '2025-12-15', amount: 15540, clearance: true },
    { week: 'WK-52', userId: 'JONES/2025/WK52', bank: 'WESTPAC', accNo: '**** 9912', type: 'NPP-FAST', date: '2025-12-18', amount: 8200, clearance: true },
    { week: 'WK-52', userId: 'DOE/2025/WK52', bank: 'NAB', accNo: '**** 0056', type: 'OSKO', date: '2025-12-20', amount: 4500, clearance: false },
    // Repeat dummy data to exceed 10 rows
    { week: 'WK-52', userId: 'USER-04/2025/WK52', bank: 'NAB', accNo: '**** 1111', type: 'OSKO', date: '2025-12-21', amount: 3000, clearance: true },
    { week: 'WK-52', userId: 'USER-05/2025/WK52', bank: 'CBA AU', accNo: '**** 2222', type: 'OSKO', date: '2025-12-21', amount: 1500, clearance: true },
    { week: 'WK-52', userId: 'USER-06/2025/WK52', bank: 'WESTPAC', accNo: '**** 3333', type: 'OSKO', date: '2025-12-21', amount: 500, clearance: true },
    { week: 'WK-52', userId: 'USER-07/2025/WK52', bank: 'NAB', accNo: '**** 4444', type: 'OSKO', date: '2025-12-22', amount: 2000, clearance: true },
    { week: 'WK-52', userId: 'USER-08/2025/WK52', bank: 'CBA AU', accNo: '**** 5555', type: 'OSKO', date: '2025-12-22', amount: 1200, clearance: true },
    { week: 'WK-52', userId: 'USER-09/2025/WK52', bank: 'WESTPAC', accNo: '**** 6666', type: 'OSKO', date: '2025-12-22', amount: 900, clearance: true },
    { week: 'WK-52', userId: 'USER-10/2025/WK52', bank: 'NAB', accNo: '**** 7777', type: 'OSKO', date: '2025-12-23', amount: 4000, clearance: true },
    { week: 'WK-52', userId: 'USER-HIDDEN/2025/WK52', bank: 'NAB', accNo: '**** 8888', type: 'OSKO', date: '2025-12-24', amount: 10000, clearance: true } // Row 11 (Hidden)
  ];

  totalBilling = computed(() => {
    // Only use the clearance date verification to add the sum
    return this.globalLedger
      .filter(row => row.clearance === true)
      .reduce((acc, row) => acc + row.amount, 0)
      .toLocaleString(undefined, { minimumFractionDigits: 2 });
  });

  onWeekChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.currentWeek.set(select.value);
    console.log('[TRANSACTIONS] Week changed to:', select.value);
  }

  exportCSV() {
    console.log('[TRANSACTIONS] Exporting CSV for week:', this.currentWeek());
    alert('CSV EXPORT INITIATED: Generating CSV file for ' + this.currentWeek());
  }

  generateReport() {
    console.log('[TRANSACTIONS] Generating PDF report for week:', this.currentWeek());
    alert('PDF REPORT GENERATION INITIATED: Generating comprehensive report for ' + this.currentWeek());
  }
}
