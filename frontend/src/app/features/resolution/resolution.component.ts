import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityService } from '../../core/services/identity.service';

@Component({
  selector: 'app-resolution',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="width: 100%; background-color: transparent; min-height: 100vh;">
      
      <div style="padding: 40px;">
        <div style="display: flex; align-items: flex-end; gap: 24px;">
          <svg width="60" height="60" viewBox="0 0 512 512" fill="#FF0000">
            <path d="M366.26,256L256,56L145.74,256L35.48,456H256h220.52L366.26,256z M462.43,448.02H327.14 c-52.29-17.46-99.26-47.08-123.05-72.78c12.09,3.24,29.59,6.3,53.32,6.78c43.69,0.87,71.69-14.09,71.69-14.09s-0.04-0.49-0.13-1.36 l0.44,1.33c10.53-38.31,14.66-76.67,9.8-143.39l20.22,36.67L462.43,448.02z M255.21,246.4c0,0,17.34,12.57,41.66,53.19 c15.5,25.89,23.07,61.65,23.07,61.65s-27.12,11.27-63.76,11.1c-37.52-0.53-63.59-9.51-63.59-9.51s5.81-34.7,21.66-61.82 C230.29,270.35,255.21,246.4,255.21,246.4z M153.41,261.17L256.42,74.33l70.68,128.2c8.42,51.22,5.65,107.88-2.38,140.27 c-3.5-14.36-9.64-32.72-20.28-49.2c-28.27-43.79-47.74-58.99-47.74-58.99s-0.36,0.2-1.01,0.63 c-42.74,11.66-77.73,28.09-123.62,64.64L153.41,261.17z M50.4,448.02l69.84-126.68c39.4-37.4,94.72-65.51,118.02-70.6 c-9.71,10.52-22.24,27.08-35.09,52.2c-18.12,35.42-20.61,64.11-20.61,64.11s0.59,0.37,1.78,0.99l-1.55-0.36 c29.53,30.52,56.36,49.88,116.46,80.35h-42.83H50.4z"/>
          </svg>

          <div style="display: flex; flex-direction: column;">
            <div style="display: block; font-family: 'Inter'; font-weight: 500; font-size: 11px; letter-spacing: 0.1em; color: #666666; text-transform: uppercase; margin-bottom: 8px;">
              DISPUTE
            </div>
            <h1 style="font-family: 'Inter'; font-weight: 900; font-size: 60px; letter-spacing: -1.5px; color: #FF0000; text-transform: uppercase; margin: 0; line-height: 1;">
              RESOLUTION
            </h1>
          </div>
        </div>

        <div style="margin-left: 84px; color: #999999; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 20px;">
          DISPUTE MANAGEMENT & SENTINEL ALERT STATE
        </div>
      </div>

      <div style="padding: 0 40px 40px; display: grid; grid-template-columns: 7fr 3fr; gap: 40px; align-items: start;">
        
        <div style="display: flex; flex-direction: column; gap: 40px;">
          
          <section style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 0 30px rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05);">
              <h3 style="font-size: 11px; letter-spacing: 0.15em; color: #FFFFFF; text-transform: uppercase; margin: 0;">
                DISPUTE CASE #{{ identity.currentUserId() || 'PENDING' }}
              </h3>

              <div style="display: flex; gap: 16px;">
                <button (click)="triggerResolution()" 
                        style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">
                  Final Resolution
                </button>
                <button (click)="downloadCase()" 
                        style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">
                  Download Case
                </button>
              </div>
            </div>

            <div style="padding: 40px;">
              <div style="display: flex; flex-direction: column; gap: 24px;">
                <div *ngFor="let case of caseData" style="padding: 24px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <div>
                      <h4 style="font-size: 12px; color: #FFFFFF; letter-spacing: 0.1em; margin-bottom: 8px; text-transform: uppercase;">{{ case.id }}</h4>
                      <p style="font-size: 11px; color: rgba(255,255,255,0.6); margin: 0;">Customer: <strong style="color: #fff;">{{ case.customerId }}</strong></p>
                    </div>
                    <div style="text-align: right;">
                      <span style="font-size: 9px; color: #FFFFFF; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">{{ case.status }}</span>
                    </div>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; font-size: 11px; color: rgba(255,255,255,0.7);">
                    <div>
                      <span style="color: rgba(255,255,255,0.4);">TYPE:</span>
                      <strong style="color: #fff; margin-left: 8px;">{{ case.caseType }}</strong>
                    </div>
                    <div>
                      <span style="color: rgba(255,255,255,0.4);">PRIORITY:</span>
                      <strong style="color: #FFFFFF; margin-left: 8px;">{{ case.priority }}</strong>
                    </div>
                    <div>
                      <span style="color: rgba(255,255,255,0.4);">AMOUNT:</span>
                      <strong style="color: #fff; margin-left: 8px;">$ {{ case.amount.toLocaleString() }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section style="background: rgba(255,0,0,0.05); border: 2px dashed rgba(255,0,0,0.3); height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 4px; gap: 20px;">
            <p style="font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.3em; margin: 0;">Red-Alert Activation Zone</p>
            <button 
              id="red-alert-button"
              (click)="triggerEscalation()" 
              style="background: #FF0000; border: none; color: #FFFFFF; font-size: 14px; padding: 16px 32px; cursor: pointer; border-radius: 4px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; box-shadow: 0 0 20px rgba(255,0,0,0.5); transition: all 0.3s ease;">
              🚨 RED-ALERT
            </button>
            <p style="font-size: 9px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.2em; margin: 0;">Click to activate global escalation state</p>
          </section>
        </div>

        <aside style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; padding: 24px;">
          <h3 style="font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.3); margin-bottom: 32px; text-transform: uppercase;">Sentinel Status</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="padding: 16px; background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.3); border-radius: 4px;">
              <div style="font-size: 10px; color: #FFFFFF; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 8px; text-transform: uppercase;">ALERT_RED</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.7);">System monitoring active disputes</div>
            </div>
            <div style="padding: 16px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;">
              <div style="font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 900; letter-spacing: 0.1em; margin-bottom: 8px; text-transform: uppercase;">CASES ACTIVE</div>
              <div style="font-size: 16px; color: #fff; font-weight: 900;">{{ caseData.length }}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `
})
export class ResolutionComponent {
  identity = inject(IdentityService);

  caseData = [
    {
      id: 'CASE-2025-001',
      customerId: 'SMITH/2025/WK52',
      caseType: 'ESCROW_DISPUTE',
      status: 'ESCALATED',
      priority: 'HIGH',
      amount: 15450.00
    },
    {
      id: 'CASE-2025-002',
      customerId: 'JONES/2025/WK52',
      caseType: 'FRAUD_ALERT',
      status: 'OPEN',
      priority: 'CRITICAL',
      amount: 8200.00
    }
  ];

  triggerEscalation() {
    console.warn("🚨 RED-ALERT BUTTON CLICKED: Activating global escalation state");
    this.identity.triggerAlert();
    alert('🚨 RED-ALERT PROTOCOL INITIATED: System state changed to ALERT_RED');
  }

  triggerResolution() {
    console.log('[RESOLUTION] Generating final resolution package for:', this.identity.currentUserId());
    alert('FINAL RESOLUTION PROTOCOL INITIATED: Generating comprehensive dispute resolution package');
  }

  downloadCase() {
    console.log('[CASE DOWNLOAD] Preparing case files for:', this.identity.currentUserId());
    alert('CASE DOWNLOAD INITIATED: Preparing dispute case documentation package');
  }
}

