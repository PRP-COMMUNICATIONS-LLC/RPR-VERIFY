import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { IntakeFormComponent } from '../verification/components/intake-form/intake-form.component';
import { DropzoneComponent } from './components/dropzone/dropzone.component';

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
  imports: [IntakeFormComponent, DropzoneComponent],
  template: `
    <!-- FORCE RENDER: Visual diagnostic indicator -->
    <!-- If you see this comment in the DOM, the component is rendering -->
    <!-- SENTINEL UNHIDE: Force visibility with explicit display and z-index -->
    <div style="width: 100%; background-color: transparent; display: block !important; visibility: visible !important; position: relative; z-index: 1; min-height: 100vh; overflow-y: visible !important;">

      <!-- FORCE RENDER: Diagnostic header - should be visible if component loads -->
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

      <!-- Main Content Column: Single Column Stack -->
      <div style="padding: 0 40px 40px; display: flex; flex-direction: column; gap: 40px;">
        
        <!-- Top: CUSTOMER DETAILS (Intake Form) - Component Quarantine -->
        @if (projectService.activeProjectId() || true) {
          <section [class.customer-details-pulse]="showCustomerDetailsPulse()" style="background: #0D0D0D; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 0 30px rgba(255, 255, 255, 0.08); border-radius: 4px; padding: 24px;">
            <app-intake-form></app-intake-form>
          </section>
        }

        <!-- Middle: ACCOUNT SUMMARY -->
        <div style="padding: 0;">
        <section style="background: #0D0D0D; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 0 30px rgba(255, 255, 255, 0.08); border-radius: 4px; overflow: hidden; width: 100%;">

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; background: rgba(255,255,255,0.03);">
            <h3 style="font-size: 11px; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase; margin: 0;">Account summary</h3>
            <div style="display: flex; gap: 24px; align-items: center;">
              <button (click)="triggerEscalation()" style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">ESCALATE CASE</button>
              <button style="background: #FFFFFF; border: none; color: #000000; font-size: 9px; padding: 10px 24px; cursor: pointer; border-radius: 2px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">GENERATE REPORT</button>
              <button (click)="resetLocal()" style="background: transparent; border: 1px solid rgba(255,255,255,0.3); color: rgba(255,255,255,0.5); font-size: 9px; padding: 8px 16px; cursor: pointer; border-radius: 2px;">RESET</button>
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
                  <td style="padding: 20px; font-family: monospace; color: rgba(255,255,255,0.5);">{{ activeProjectId() || 'NO_ID' }}</td>
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

        <!-- Bottom: KYC/AML DOCUMENT INGESTION (Dropzone) - Component Quarantine -->
        <!-- FIX: Add padding-bottom to prevent content cutoff -->
        @if (projectService.activeProjectId() || true) {
          <section style="width: 100%; padding-bottom: 100px;">
            <app-dropzone></app-dropzone>
          </section>
        }
      </div>
    </div>
    `
})
export class InformationComponent implements OnInit {
  projectService = inject(ProjectService);
  isDepositAdded = signal(false);
  ledgerData = signal<LedgerData[]>([]);
  showCustomerDetailsPulse = signal(false);
  
  // Cache the active project ID to avoid repeated computed evaluations in template
  readonly activeProjectId = computed(() => {
    const result = this.projectService.activeProjectId();
    
    // Trigger pulse animation when project ID changes from null to a value
    if (result && !this.previousProjectId) {
      this.triggerCustomerDetailsPulse();
    }
    this.previousProjectId = result;
    
    return result;
  });
  
  private previousProjectId: string | null = null;
  
  constructor() {
    // FORCE RENDER: Diagnostic logging to verify component initialization
    console.log('[INFORMATION COMPONENT] Constructor executing - Component is initializing');
    console.log('[INFORMATION COMPONENT] ProjectService injected:', !!this.projectService);
    console.log('[INFORMATION COMPONENT] Active Project ID:', this.activeProjectId());
    
    // Watch for extracted identity and trigger border pulse when form is populated
    effect(() => {
      const identity = this.projectService.extractedIdentity();
      if (identity && identity.firstName) {
        // Trigger pulse when identity is extracted and form will be populated
        // Use setTimeout to ensure form population completes first
        setTimeout(() => {
          this.triggerCustomerDetailsPulse();
        }, 100);
      }
    });
  }
  
  // FORCE RENDER: Lifecycle hook to verify component rendered
  ngOnInit() {
    console.log('[INFORMATION COMPONENT] ngOnInit - Component view should be rendered');
    // Force a change detection cycle to ensure template renders
    setTimeout(() => {
      console.log('[INFORMATION COMPONENT] Post-render check - Template should be visible');
    }, 0);
  }

  simulateDepositIngestion() {
    // Legacy method - can be removed or updated to use ProjectService
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
    this.projectService.resetProject();
    this.isDepositAdded.set(false);
    this.ledgerData.set([]);
    this.previousProjectId = null;
  }
  
  /**
   * Trigger pulse animation on Customer Details card
   */
  private triggerCustomerDetailsPulse(): void {
    this.showCustomerDetailsPulse.set(true);
    // Remove pulse class after animation completes
    setTimeout(() => {
      this.showCustomerDetailsPulse.set(false);
    }, 500);
  }
}