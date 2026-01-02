import { Component } from '@angular/core';

@Component({
  selector: 'app-resolution-rationale',
  standalone: true,
  template: `
    <div class="p-6 bg-slate-900 border border-slate-800 rounded-lg">
      <h2 class="text-white text-lg font-bold mb-4 italic">Sovereign Decision Log</h2>
      <textarea 
        placeholder="Address Sentinel alerts TR-01 through TR-05 here..." 
        class="w-full h-40 bg-slate-950 border border-slate-800 text-slate-300 p-4 text-sm focus:border-cyan-500 outline-none rounded"
      ></textarea>
      <div class="flex justify-end mt-4">
        <button class="px-6 py-2 bg-cyan-700 text-white text-xs uppercase font-bold hover:bg-cyan-600 rounded">Seal & Finalize</button>
      </div>
    </div>
  `
})
export class ResolutionRationaleComponent {}
