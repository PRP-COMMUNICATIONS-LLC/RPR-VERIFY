import { Component, inject, signal } from '@angular/core';

import { IdentityService } from '../../core/services/identity.service';

export interface LedgerData {
  bank: string;
  accNo: string;
  type: string;
  date: string;
  clearance: string;
  amount: string;
}

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [],
  template: `
    <div style="width: 100%; background-color: transparent; min-height: 100vh;">

      <div style="padding: 40px; display: flex; flex-direction: column;">
        <div style="margin-left: 84px; display: flex; flex-direction: column;">
          <div style="display: block !important; visibility: visible !important; font-family: 'Inter'; font-weight: 500; font-size: 11px; letter-spacing: 0.1em; color: #666666; text-transform: uppercase; margin-bottom: 8px;">
            CUSTOMER
          </div>

          <h1 style="font-family: 'Inter'; font-weight: 900; font-size: 60px; letter-spacing: -1.5px; color: #FFFFFF; text-transform: uppercase; margin: 0; line-height: 1;">
            INFORMATION
          </h1>
        </div>

        <div style="margin-left: 84px; color: #999999; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 20px;">
          CLIENT IDENTITY VERIFICATION AND TRANSACTION LEDGER
        </div>
      </div>

      <div style="padding: 0 40px 40px; display: grid; grid-template-columns: 7fr 3fr; gap: 40px; align-items: stretch;">

        <section (click)="simulateDepositIngestion()" (keydown.enter)="simulateDepositIngestion()" role="button" tabindex="0"
          style="background: rgba(255,255,255,0.01); border: 1px dashed rgba(0,224,255,0.2); border-radius: 4px; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
          <h2 style="font-size: 10px; letter-spacing: 0.3em; color: #00E0FF; margin: 0;">KYC/AML DROP ZONE</h2>
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 12px; text-transform: uppercase;">Drag & Drop Deposit Slips to Link Funds</p>

          @if (identity.currentUserId()) {
            <div style="margin-top: 15px; padding: 6px 16px; background: rgba(0,224,255,0.1); border: 1px solid #00E0FF; border-radius: 2px;">
              <span style="font-size: 10px; color: #fff; font-weight: 900; letter-spacing: 0.1em;">ID GENESIS: {{ identity.currentUserId() }}</span>
            </div>
          }
        </section>

        <aside style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; padding: 24px; height: 200px; display: flex; flex-direction: column;">
          <h3 style="font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.3); margin-bottom: 24px; text-transform: uppercase;">Details</h3>
          <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
            @for (item of ['ID Document', 'Address Proof', 'Bank Account Info', 'ABN/Registration', 'Deposit Slips']; track item) {
              <div
                style="display: flex; align-items: center; gap: 16px; font-size: 11px;">
                <div [style.background]="(item === 'Deposit Slips' ? isDepositAdded() : identity.currentUserId()) ? '#00E0FF' : 'transparent'"
                style="width: 10px; height: 10px; border: 1px solid #00E0FF; border-radius: 1px;"></div>
                <span [style.opacity]="(item === 'Deposit Slips' ? isDepositAdded() : identity.currentUserId()) ? 1 : 0.3">{{ item }}</span>
              </div>
            }
          </div>
        </aside>
      </div>

      <div style="padding: 0 40px 40px;">
        <section style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 0 30px rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; width: 100%;">

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background: rgba(255,255,255,0.03);">
            <h3 style="font-size: 11px; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase; margin: 0;">Account summary</h3>
            <div style="display: flex; gap: 24px; align-items: center;">
              <button (click)="triggerEscalation()" style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">ESCALATE CASE</button>
              <button style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">GENERATE REPORT</button>
              <button (click)="resetLocal()" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.5); font-size: 9px; padding: 8px 16px; cursor: pointer; border-radius: 2px;">RESET</button>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
            <thead>
              <tr style="background: #1A1A1A; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.2);">
                <th style="padding: 16px 20px; color: #888888; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 0.1em;">USER ID</th>
                <th style="padding: 16px 20px; color: #888888; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 0.1em;">BANK</th>
                <th style="padding: 16px 20px; color: #888888; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 0.1em;">ACCOUNT NO</th>
                <th style="padding: 16px 20px; color: #888888; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 0.1em;">TYPE</th>
                <th style="padding: 16px 20px; color: #888888; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 0.1em;">DEPOSIT DATE</th>
                <th style="padding: 16px 20px; color: #888888; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 0.1em;">CLEARANCE DATE</th>
                <th style="padding: 16px 20px; color: #FFFFFF; text-transform: uppercase; font-size: 9px; font-weight: 900; letter-spacing: 0.1em; text-align: right;">TOTAL (AUD)</th>
              </tr>
            </thead>
            <tbody>
              @for (row of ledgerData(); track row) {
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03); color: #ffffff;">
                  <td style="padding: 20px; font-family: monospace; color: rgba(255,255,255,0.5);">{{ identity.currentUserId() }}</td>
                  <td style="padding: 20px;">{{ row.bank }}</td>
                  <td style="padding: 20px; color: rgba(255,255,255,0.4);">{{ row.accNo }}</td>
                  <td style="padding: 20px;"><span style="color: #FFFFFF; font-weight: 700;">{{ row.type }}</span></td>
                  <td style="padding: 20px;">{{ row.date }}</td>
                  <td style="padding: 20px;">{{ row.clearance }}</td>
                  <td style="padding: 20px; font-weight: 900; text-align: right; color: #FFFFFF;">$ {{ row.amount }}</td>
                </tr>
              }
              @if (ledgerData().length === 0) {
                <tr>
                  <td colspan="7" style="padding: 40px; text-align: center; color: rgba(255,255,255,0.1); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;">
                    Awaiting Ingestion...
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </section>
      </div>
    </div>
    `
})
export class InformationComponent {
  identity = inject(IdentityService);
  isDepositAdded = signal(false);
  ledgerData = signal<LedgerData[]>([]);

  simulateDepositIngestion() {
    this.identity.generateGenesisId('SMITH');
    this.isDepositAdded.set(true);
    this.ledgerData.set([
      { bank: 'CBA AU', accNo: '**** 4290', type: 'OSKO', date: '2025-12-15', clearance: '2025-12-15', amount: '15,540.00' },
      { bank: 'Westpac', accNo: '**** 9912', type: 'NPP-FAST', date: '2025-12-18', clearance: '2025-12-18', amount: '1,250.50' },
      { bank: 'NAB', accNo: '**** 0056', type: 'OSKO', date: '2025-12-20', clearance: '2025-12-20', amount: '3,200.75' }
    ]);
  }

  triggerEscalation() {
    alert('ESCALATION PROTOCOL INITIATED');
  }

  resetLocal() {
    this.identity.resetIdentity();
    this.isDepositAdded.set(false);
    this.ledgerData.set([]);
  }
}