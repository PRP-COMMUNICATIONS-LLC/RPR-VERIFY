// Path: sentinel-engine/frontend/src/app/features/resolution/resolution-rationale.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-resolution-rationale',
  standalone: true,
  template: `
    <div class="p-6 bg-slate-900 border border-slate-800 rounded-lg">
      <h2 class="text-white text-lg font-bold mb-4">Sovereign Decision Log</h2>
      <div class="space-y-4">
        <label class="block text-xs font-mono text-slate-500 uppercase">Decision Rationale (Mandatory)</label>
        <textarea 
          placeholder="Address Sentinel alerts TR-01 through TR-05 here..."
          class="w-full h-40 bg-slate-950 border border-slate-800 text-slate-200 p-4 text-sm focus:border-cyan-500 outline-none"
        ></textarea>
        
        <div class="flex justify-end gap-4 mt-6">
          <button class="px-6 py-2 border border-slate-700 text-slate-400 text-xs uppercase font-bold hover:bg-slate-800 transition">Escalate</button>
          <button class="px-6 py-2 bg-cyan-600 text-white text-xs uppercase font-bold hover:bg-cyan-500 shadow-lg shadow-cyan-900/20 transition">Seal & Close Case</button>
        </div>
      </div>
    </div>
  `
})
export class ResolutionRationaleComponent {}