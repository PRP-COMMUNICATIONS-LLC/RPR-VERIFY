import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { IdentityService } from '../../core/services/identity.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="width: 100%; background-color: transparent; min-height: 100vh;">

      <div style="padding: 40px;">
        <div style="display: flex; align-items: flex-end; gap: 24px;">
          <svg width="60" height="60" viewBox="0 0 512 512" [attr.fill]="pulseColor()">
            <path d="M366.26,256L256,56L145.74,256L35.48,456H256h220.52L366.26,256z M462.43,448.02H327.14 c-52.29-17.46-99.26-47.08-123.05-72.78c12.09,3.24,29.59,6.3,53.32,6.78c43.69,0.87,71.69-14.09,71.69-14.09s-0.04-0.49-0.13-1.36 l0.44,1.33c10.53-38.31,14.66-76.67,9.8-143.39l20.22,36.67L462.43,448.02z M255.21,246.4c0,0,17.34,12.57,41.66,53.19 c15.5,25.89,23.07,61.65,23.07,61.65s-27.12,11.27-63.76,11.1c-37.52-0.53-63.59-9.51-63.59-9.51s5.81-34.7,21.66-61.82 C230.29,270.35,255.21,246.4,255.21,246.4z M153.41,261.17L256.42,74.33l70.68,128.2c8.42,51.22,5.65,107.88-2.38,140.27 c-3.5-14.36-9.64-32.72-20.28-49.2c-28.27-43.79-47.74-58.99-47.74-58.99s-0.36,0.2-1.01,0.63 c-42.74,11.66-77.73,28.09-123.62,64.64L153.41,261.17z M50.4,448.02l69.84-126.68c39.4-37.4,94.72-65.51,118.02-70.6 c-9.71,10.52-22.24,27.08-35.09,52.2c-18.12,35.42-20.61,64.11-20.61,64.11s0.59,0.37,1.78,0.99l-1.55-0.36 c29.53,30.52,56.36,49.88,116.46,80.35h-42.83H50.4z"/>
          </svg>

          <div style="display: flex; flex-direction: column;">
            <div style="display: block; font-family: 'Inter'; font-weight: 500; font-size: 11px; letter-spacing: 0.1em; color: #666666; text-transform: uppercase; margin-bottom: 8px;">
              PROACTIVE
            </div>
            <h1 [style.color]="pulseColor()" style="font-family: 'Inter'; font-weight: 900; font-size: 60px; letter-spacing: -1.5px; text-transform: uppercase; margin: 0; line-height: 1;">
              VERIFICATION
            </h1>
          </div>
        </div>

        <div style="margin-left: 84px; color: #999999; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 20px;">
          CUSTOMER INFORMATION SHEET (CIS) & DOSSIER PREVIEW
        </div>
      </div>

      <div style="padding: 0 40px 40px; display: grid; grid-template-columns: 7fr 3fr; gap: 40px; align-items: stretch;">

        <section style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden;">

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05);">
            <h3 style="font-size: 11px; letter-spacing: 0.15em; color: #FFFFFF; text-transform: uppercase; margin: 0;">
              CIS Document #{{ identity.currentUserId() || 'PENDING' }}
            </h3>

            <div style="display: flex; gap: 16px;">
              <button (click)="triggerVerificationReport()"
                style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">
                Verification Report
              </button>
              <button (click)="generateCIS()"
                style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">
                Generate Report
              </button>
            </div>
          </div>

          <div style="padding: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div>
              <h4 style="font-size: 10px; color: #FFFFFF; letter-spacing: 0.1em; margin-bottom: 16px; text-transform: uppercase;">I. Identity Section</h4>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.7);">
                <p>FULL NAME: <strong style="color: #fff;">JONATHAN QUINTON SMITH</strong></p>
                <p>ID NUMBER: <strong style="color: #fff;">SMITH202552</strong></p>
                <p>VERIFICATION: <strong style="color: #FFFFFF;">NOMINAL</strong></p>
              </div>
            </div>

            <div>
              <h4 style="font-size: 10px; color: #FFFFFF; letter-spacing: 0.1em; margin-bottom: 16px; text-transform: uppercase;">II. Address Section</h4>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.7);">
                <p>STREET: <strong style="color: #fff;">123 FINANCIAL DISTRICT</strong></p>
                <p>POSTAL CODE: <strong style="color: #fff;">2000 AU</strong></p>
                <p>COUNTRY: <strong style="color: #fff;">AUSTRALIA</strong></p>
              </div>
            </div>

            <div>
              <h4 style="font-size: 10px; color: #FFFFFF; letter-spacing: 0.1em; margin-bottom: 16px; text-transform: uppercase;">III. Entity Section</h4>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.7);">
                <p>TYPE: <strong style="color: #fff;">BUSINESS TRUST</strong></p>
                <p>ABN: <strong style="color: #fff;">12 345 678 901</strong></p>
                <p>STATUS: <strong style="color: #fff;">ACTIVE / REGISTERED</strong></p>
              </div>
            </div>

            <div>
              <h4 style="font-size: 10px; color: #FFFFFF; letter-spacing: 0.1em; margin-bottom: 16px; text-transform: uppercase;">IV. Bank Section</h4>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.7);">
                <p>BANK: <strong style="color: #fff;">CBA AU (COMMONWEALTH)</strong></p>
                <p>ACCOUNT: <strong style="color: #fff;">BUSINESS CHECKING</strong></p>
                <p>BRANCH: <strong style="color: #fff;">SYDNEY CENTRAL</strong></p>
              </div>
            </div>
          </div>
        </section>

        <aside style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; padding: 24px;">
          <h3 style="font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.3); margin-bottom: 32px; text-transform: uppercase;">Customer Ledger</h3>
          @for (row of ledgerData; track row) {
            <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px;">
                <span style="color: rgba(255,255,255,0.4);">{{ row.date }}</span>
                <span style="color: #FFFFFF; font-weight: 900;">$ {{ row.amount }}</span>
              </div>
              <div style="font-size: 10px; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;">{{ row.bank }}</div>
            </div>
          }
        </aside>
      </div>

      <!-- VERIFICATION PULSE SCANNER SECTION -->
      <div style="padding: 0 40px 40px;">
        <section style="background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; width: 100%; min-height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">

          <div style="position: absolute; top: 20px; right: 32px; color: rgba(255,255,255,0.3); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;">
            Forensic Scanner: {{ currentPhaseLabel() }}
          </div>

          <!-- Pulse Scanner Container -->
          <div style="position: relative; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center;">

            <!-- Pulse Rings -->
            @if (status() === 'SCANNING') {
              <div
                [style.border-color]="pulseColor()"
              style="position: absolute; width: 200px; height: 200px; border-radius: 50%; border: 2px solid; opacity: 0; animation: sovereign-pulse 3s infinite ease-out;"></div>
            }
            @if (status() === 'SCANNING') {
              <div
                [style.border-color]="pulseColor()"
              style="position: absolute; width: 200px; height: 200px; border-radius: 50%; border: 2px solid; opacity: 0; animation: sovereign-pulse 3s infinite ease-out; animation-delay: 1s;"></div>
            }
            @if (status() === 'SCANNING') {
              <div
                [style.border-color]="pulseColor()"
              style="position: absolute; width: 200px; height: 200px; border-radius: 50%; border: 2px solid; opacity: 0; animation: sovereign-pulse 3s infinite ease-out; animation-delay: 2s;"></div>
            }

            <!-- Central Core -->
            <div [style.background]="pulseColor()"
              [style.box-shadow]="'0 0 20px ' + pulseShadowColor()"
              style="position: absolute; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              @if (status() === 'COMPLETED') {
                <span style="color: #000000; font-size: 32px; font-weight: 900;">✓</span>
              }
            </div>
          </div>

          <!-- Readout Overlay -->
          <div style="margin-top: 60px; text-align: center; width: 100%; max-width: 400px;">
            <div [style.color]="pulseColor()" style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px;">
              {{ currentPhaseLabel() }}
            </div>

            <!-- Progress Bar -->
            <div style="width: 100%; height: 2px; background: rgba(255,255,255,0.1); border-radius: 1px; overflow: hidden;">
              <div [style.width.%]="(scanStep() / 3) * 100"
                [style.background]="pulseColor()"
              style="height: 100%; transition: width 0.5s ease-out;"></div>
            </div>

            @if (status() === 'COMPLETED') {
              <div
                style="margin-top: 24px; font-size: 10px; color: rgba(255,255,255,0.6); letter-spacing: 0.2em; text-transform: uppercase;">
                VERIFICATION COMPLETE
              </div>
            }
          </div>

          <!-- CSS Keyframes inline -->
          <style>
            @keyframes sovereign-pulse {
            0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
          transform: scale(2.5);
          opacity: 0;
        }
      }
    </style>
    </section>
    </div>
    </div>
    `
})
export class VerificationComponent implements OnInit {
  identity = inject(IdentityService);

  // Sovereign State Machine for Pulse Scanner
  readonly scanStep = signal<number>(0);
  readonly status = signal<'SCANNING' | 'COMPLETED'>('SCANNING');

  // Derived metadata for display
  readonly currentPhaseLabel = computed(() => {
    const labels = ['INITIALIZING', 'IDENTITY SCAN', 'HISTORY CROSS-CHECK', 'FORENSIC VERIFICATION'];
    return labels[this.scanStep()] || 'PROCESSING';
  });

  // Pulse Scanner Color: Reactive to escalation state (Cyan ↔ Red)
  readonly pulseColor = computed(() => {
    return this.identity.isEscalated() ? '#FF0000' : '#00E0FF';
  });

  // Pulse Scanner Shadow Color: Reactive to escalation state
  readonly pulseShadowColor = computed(() => {
    return this.identity.isEscalated() ? 'rgba(255,0,0,0.5)' : 'rgba(0,224,255,0.5)';
  });

  ledgerData = [
    { date: '2025-12-15', amount: '15,540.00', bank: 'CBA AU' },
    { date: '2025-12-18', amount: '1,250.50', bank: 'WESTPAC' },
    { date: '2025-12-20', amount: '3,200.75', bank: 'NAB' }
  ];

  ngOnInit() {
    this.runForensicSequence();
  }

  private runForensicSequence() {
    const sequence = [
      { step: 1, delay: 1000 },
      { step: 2, delay: 2500 },
      { step: 3, delay: 4000 },
      { step: 4, delay: 5500 }
    ];

    sequence.forEach(phase => {
      setTimeout(() => {
        if (phase.step <= 3) {
          this.scanStep.set(phase.step);
        } else {
          this.status.set('COMPLETED');
        }
      }, phase.delay);
    });
  }

  triggerVerificationReport() {
    // Comprehensive Verification Report: CIS + Transaction Ledger + Scanned Deposit Slips + Bank Email Instructions
    console.log('[VERIFICATION REPORT] Generating comprehensive forensic package...');
    console.log('[VERIFICATION REPORT] Including:', {
      cisDocument: this.identity.currentUserId(),
      transactionLedger: this.ledgerData,
      scannedDeposits: 'Deposit slip images',
      bankInstructions: 'Bank email analysis from Sentinel Protocol'
    });
    alert('VERIFICATION REPORT PROTOCOL INITIATED: Generating comprehensive forensic package (CIS + Ledger + Scans + Bank Instructions)');
  }

  generateCIS() {
    // Standard CIS-only report generation
    console.log('[CIS REPORT] Generating Customer Information Sheet for:', this.identity.currentUserId());
    alert('CIS REPORT GENERATED: Customer Information Sheet PDF');
  }
}

