import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-new-case',
    standalone: true,
    imports: [CommonModule],
    template: `
    <!-- AG-LESSON: New Case screen structured to match Visual 2 (Create New Case Draft). -->
    <div class="max-w-5xl mx-auto animate-fade-in">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold text-white">Create New Case (Draft)</h1>
            <div class="flex gap-3">
                <button class="px-4 py-2 border border-slate-600 rounded text-slate-300 text-sm hover:bg-slate-800">Cancel</button>
                <button class="px-4 py-2 bg-blue-600 rounded text-white text-sm hover:bg-blue-500 font-medium">Create Case</button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Case Summary Card -->
            <div class="bg-[var(--rpr-ink)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
                <h3 class="text-white font-semibold mb-4 border-b border-slate-800 pb-2">Case Summary</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-slate-400 text-xs uppercase tracking-wider mb-1">Description</label>
                        <textarea class="w-full bg-black/40 border border-slate-700 rounded p-3 text-white text-sm h-32" placeholder="e.g. Suspicious activity detected in account #8907..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Key Details Card -->
            <div class="bg-[var(--rpr-ink)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6">
                <h3 class="text-white font-semibold mb-4 border-b border-slate-800 pb-2">Key Details</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-slate-400 text-xs uppercase tracking-wider mb-1">Risk Score (Initial)</label>
                        <input type="text" class="w-full bg-black/40 border border-slate-700 rounded p-2 text-white text-sm" value="85 (High)" />
                    </div>
                    <div>
                        <label class="block text-slate-400 text-xs uppercase tracking-wider mb-1">Assigned To</label>
                        <select class="w-full bg-black/40 border border-slate-700 rounded p-2 text-white text-sm">
                            <option>Assign to Self</option>
                            <option>T. Jones</option>
                            <option>Sarah M.</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Involved Parties -->
            <div class="bg-[var(--rpr-ink)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 lg:col-span-2">
                <h3 class="text-white font-semibold mb-4 border-b border-slate-800 pb-2">Involved Parties</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-slate-400 text-xs uppercase tracking-wider mb-1">Customer</label>
                        <input type="text" class="w-full bg-black/40 border border-slate-700 rounded p-2 text-white text-sm" placeholder="Search Customer ID..." />
                    </div>
                    <div>
                        <label class="block text-slate-400 text-xs uppercase tracking-wider mb-1">Beneficiary</label>
                        <input type="text" class="w-full bg-black/40 border border-slate-700 rounded p-2 text-white text-sm" placeholder="Beneficiary Name" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    :host {
        display: block;
        padding: 24px;
    }
  `]
})
export class NewCaseComponent { }
