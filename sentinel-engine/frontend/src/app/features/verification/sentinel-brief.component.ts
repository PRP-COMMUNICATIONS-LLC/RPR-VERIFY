// Path: sentinel-engine/frontend/src/app/features/verification/sentinel-brief.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sentinel-brief',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sentinel-container bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      <div [ngClass]="{
        'bg-amber-600/20 text-amber-400 border-amber-600/50': riskLevel === 'AMBER',
        'bg-red-600/20 text-red-400 border-red-600/50': riskLevel === 'RED',
        'bg-emerald-600/20 text-emerald-400 border-emerald-600/50': riskLevel === 'GREEN'
      }" class="p-4 border-b flex justify-between items-center">
        <span class="font-bold tracking-widest text-xs uppercase">Sentinel Status: {{ riskLevel }}</span>
        <span class="font-mono text-[10px]">{{ sentinelVersion }}</span>
      </div>

      <div class="p-6 space-y-6">
        <div>
          <h3 class="text-slate-500 text-[10px] uppercase font-bold mb-2">Forensic Brief</h3>
          <p class="text-slate-200 text-sm leading-relaxed">{{ forensicBrief }}</p>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <div *ngFor="let trigger of activeTriggers" 
               class="p-3 bg-slate-950 border border-slate-800 rounded flex gap-4 items-start">
            <div class="mt-1 w-2 h-2 rounded-full bg-amber-500"></div>
            <div>
              <p class="text-xs font-bold text-slate-300 uppercase tracking-tight">{{ trigger.name }}</p>
              <p class="text-[11px] text-slate-500 mt-1 italic">{{ trigger.narrative }}</p>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800">
          <h3 class="text-slate-500 text-[10px] uppercase font-bold mb-3">Recommended Forensic Actions</h3>
          <ul class="space-y-2">
            <li *ngFor="let action of recommendations" class="text-xs text-cyan-500 flex gap-2">
              <span>→</span> {{ action }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class SentinelBriefComponent {
  @Input() riskLevel: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
  @Input() forensicBrief: string = '';
  @Input() activeTriggers: any[] = [];
  @Input() recommendations: string[] = [];
  sentinelVersion = 'SENTINEL-v1.0.4';
}