import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationService, ForensicMetadata } from '../../core/services/verification.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-sentinel-brief',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="forensicData$ | async as data" class="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
      <div [ngClass]="{'bg-amber-600/20 text-amber-400': data.riskLevel === 'AMBER', 'bg-red-600/20 text-red-400': data.riskLevel === 'RED'}" class="p-4 border-b flex justify-between">
        <span class="font-bold text-xs uppercase italic tracking-widest">Sentinel Engine Active</span>
        <span class="font-mono text-[10px]">{{ data.riskLevel }} POSTURE</span>
      </div>
      <div class="p-6 space-y-4">
        <p class="text-slate-200 text-sm leading-relaxed">{{ data.forensicBrief }}</p>
        <div class="grid gap-2">
          <div *ngFor="let trigger of data.activeTriggers" class="p-2 bg-slate-950 border border-slate-800 rounded text-[11px]">
            <span class="text-amber-500 font-bold uppercase">{{ trigger.id }}:</span>
            <span class="text-slate-400 italic"> {{ trigger.narrative }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SentinelBriefComponent implements OnInit {
  private verificationService = inject(VerificationService);

  @Input() caseId: string = '';

  forensicData$: Observable<ForensicMetadata> = of({
    riskLevel: 'GREEN',
    forensicBrief: 'Initializing...',
    activeTriggers: []
  });

  ngOnInit(): void {
    if (this.caseId) {
      this.forensicData$ = this.verificationService.getForensicMetadata(this.caseId);
    }
  }
}
