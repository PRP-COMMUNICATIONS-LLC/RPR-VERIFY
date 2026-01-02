import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resolution-rationale',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 bg-slate-900 border border-slate-800 rounded-lg">
      <h2 class="text-white text-lg font-bold mb-4 italic">Sovereign Decision Log</h2>
      <textarea 
        [(ngModel)]="rationale"
        placeholder="Address Sentinel alerts TR-01 through TR-05 here..." 
        class="w-full h-40 bg-slate-950 border border-slate-800 text-slate-300 p-4 text-sm focus:border-cyan-500 outline-none rounded"
      ></textarea>
      <div class="flex justify-end mt-4">
        <button
          [disabled]="!rationale || rationale.trim() === ''"
          [ngClass]="{
            'bg-cyan-700 hover:bg-cyan-600': rationale && rationale.trim() !== '',
            'bg-slate-700 cursor-not-allowed': !rationale || rationale.trim() === ''
          }"
          class="px-6 py-2 text-white text-xs uppercase font-bold rounded transition-colors"
        >
          Seal & Finalize
        </button>
      </div>
    </div>
  `
})
export class ResolutionRationaleComponent {
  rationale = '';
}
