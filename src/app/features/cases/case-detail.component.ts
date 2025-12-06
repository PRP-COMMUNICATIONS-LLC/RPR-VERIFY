import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-case-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    styles: [`
      .dispute-panel,
      .timeline-panel,
      .evidence-panel,
      .outcomes-panel,
      .related-cases-panel {
        background: var(--panel-bg);
        border: 1px solid var(--panel-border);
        border-radius: 12px;
      }
      .kyc-dropzone {
        background: var(--panel-bg);
        border: 1px dashed var(--panel-border);
        border-radius: 12px;
        padding: 24px;
      }
    `],
    template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center gap-4 text-slate-400 text-sm mb-4">
        <a routerLink="/cases" class="hover:text-white">Cases</a>
        <span>/</span>
        <span class="text-white">{{ id }}</span>
      </div>

      <div class="related-cases-panel rounded-2xl p-8 shadow-lg shadow-black/40">
        <h2 class="text-2xl font-bold text-white mb-2">Case Details: {{ id }}</h2>
        <p class="text-slate-400">Details for the selected compliance case.</p>
        
        <div class="mt-8 grid grid-cols-2 gap-8">
           <!-- Placeholder Details -->
           <div class="space-y-1">
             <label class="text-xs uppercase text-slate-500 font-semibold tracking-wider">Status</label>
             <div class="text-white text-lg">In Review</div>
           </div>
           <div class="space-y-1">
             <label class="text-xs uppercase text-slate-500 font-semibold tracking-wider">Risk Score</label>
             <div class="text-rpr-alert-red text-lg font-bold">High (85/100)</div>
           </div>
        </div>
      </div>

      <!-- TODO: KYC Upload & Client ID Section -->
      <section class="kyc-dropzone mt-6">
        <h2 class="text-xl font-semibold text-white mb-2">Customer KYC Documents</h2>
        <p class="text-slate-400">This panel will handle KYC uploads and client ID tracking in a later phase.</p>
      </section>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseDetailComponent {
    @Input() id?: string;
}
