import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentinelTrigger } from '../../core/services/verification.service';

@Component({
  selector: 'app-sentinel-brief',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      @if (riskLevel !== 'GREEN') {
        <div [ngClass]="{'bg-amber-600/20 text-amber-400': riskLevel === 'AMBER', 'bg-red-600/20 text-red-400': riskLevel === 'RED'}" class="p-4 border-b flex justify-between">
          <span class="font-bold text-xs uppercase tracking-widest">Sentinel Engine Active</span>
          <span class="font-mono text-[10px]">{{ riskLevel }} POSTURE</span>
        </div>
      }
      <div class="p-6 space-y-4">
        <p class="text-slate-200 text-sm leading-relaxed">{{ forensicBrief }}</p>
        <div class="grid gap-2">
          @for (trigger of activeTriggers; track trigger.id) {
            <div class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px]">
              <span class="text-amber-500 font-bold uppercase">{{ trigger.id }}:</span> 
              <span class="text-slate-400 italic">{{ trigger.narrative }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SentinelBriefComponent {
  @Input() riskLevel: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
  @Input() forensicBrief = '';
  @Input() activeTriggers: SentinelTrigger[] = [];
}
