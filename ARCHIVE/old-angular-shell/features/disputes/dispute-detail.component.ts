import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dispute-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dispute-container fade-in">
        <!-- Header -->
        <div class="header-section">
            <div>
                <h1 class="text-2xl font-bold text-white mb-1">Dispute Detail: Case #3849-AC</h1>
                <div class="status-badges flex gap-4 text-sm">
                    <span class="flex items-center gap-2 text-slate-400">Status <span class="text-white flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span> In Progress</span></span>
                    <span class="flex items-center gap-2 text-slate-400">Created <span class="text-white">2023-11-01</span></span>
                    <span class="flex items-center gap-2 text-slate-400">Assigned To <span class="text-white">Sarah M.</span></span>
                    <span class="flex items-center gap-2 text-slate-400">Priority <span class="text-white flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-500"></span> High</span></span>
                </div>
            </div>
            <div class="actions flex gap-2">
                <button class="btn-primary">Resolve Dispute</button>
                <button class="btn-secondary">⚠ Escalate</button>
                <button class="btn-secondary">✎ Add Note</button>
            </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <!-- Timeline -->
            <div class="card p-6">
                <h3 class="card-title mb-6">Dispute Timeline</h3>
                <div class="timeline space-y-6">
                    <div class="timeline-item relative pl-8 pb-4 border-l border-slate-700">
                        <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500/20 border border-red-500"></div>
                        <div class="text-xs text-slate-400 mb-1">2023-11-01</div>
                        <div class="text-white font-medium">Dispute Initiated by Customer</div>
                        <div class="text-sm text-slate-400">Dispute initiated by customer satisfying compliance action requirements.</div>
                    </div>
                    <div class="timeline-item relative pl-8 pb-4 border-l border-slate-700">
                        <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full timeline-dot-accent"></div>
                        <div class="text-xs text-slate-400 mb-1">2023-11-02</div>
                        <div class="text-white font-medium">Initial Review Started</div>
                        <div class="text-sm text-slate-400">Initial review started to process and categorize.</div>
                    </div>
                </div>
            </div>

            <!-- Evidence -->
            <div class="card p-6">
                <h3 class="card-title mb-6">Evidence & Documentation</h3>
                <!-- AG-LESSON: Dispute / detail view aligned to Visual 3 and includes evidence placeholder. -->
                <div class="space-y-4">
                    <div class="evidence-placeholder border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-rpr-cyan hover:bg-white/5 transition-all">
                        <div class="text-2xl mb-2">📂</div>
                        <div class="text-white text-sm font-medium">Customer Evidence</div>
                        <div class="text-xs text-slate-500 mt-1">Drop files here or Browse</div>
                    </div>
                    
                    <div class="file-item flex items-center justify-between p-3 border border-slate-800 rounded bg-black/20">
                        <div class="flex items-center gap-3">
                            <i class="icon-file text-slate-400">📄</i>
                            <div>
                                <div class="text-white text-sm">Invoice_#345.pdf</div>
                                <div class="text-xs text-slate-500">1.2MB</div>
                            </div>
                        </div>
                        <button class="file-action">View</button>
                    </div>
                    <div class="file-item flex items-center justify-between p-3 border border-slate-800 rounded bg-black/20">
                        <div class="flex items-center gap-3">
                            <i class="icon-file text-slate-400">✉</i>
                            <div>
                                <div class="text-white text-sm">Email_Correspondence...</div>
                                <div class="text-xs text-slate-500">50KB</div>
                            </div>
                        </div>
                        <button class="file-action">View</button>
                    </div>
                </div>
            </div>

            <!-- Outcomes & Actions -->
            <div class="space-y-6">
                <div class="card p-6">
                    <h3 class="card-title mb-6">Outcomes & Actions</h3>
                    <div class="mb-4">
                        <div class="text-sm text-white font-medium mb-2">Pending Decision</div>
                        <div class="text-xs text-slate-400 mb-2">Action Required: Verify Additional Proof</div>
                        <textarea class="w-full bg-black/40 border border-slate-700 rounded p-2 text-white text-sm" placeholder="Add comment or action note"></textarea>
                    </div>
                    <div class="flex justify-end">
                        <button class="btn-primary text-sm px-4 py-1">Submit</button>
                    </div>
                </div>

                <div class="card p-6">
                    <h3 class="card-title mb-4">Related Cases</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="text-white text-sm">Case #3850</div>
                            <div class="text-xs text-slate-400">Similar dispute type</div>
                        </div>
                        <div>
                            <div class="text-white text-sm">Case #3800</div>
                            <div class="text-xs text-slate-400">Previous customer dispute</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .dispute-container {
        padding: 0;
    }
    .header-section {
        display: flex;
        justify-content: space-between;
    }
    .timeline-dot-accent { background: rgba(0, 217, 204, 0.2); border: 1px solid var(--accent-primary); }
    .timeline-item {
        align-items: flex-start;
        padding-bottom: 24px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .card {
        background-color: var(--panel-bg);
        border: 1px solid var(--panel-border);
        border-radius: 12px;
    }
    .file-action,
    .view-button {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 4px;                /* rectangular, consistent with tags */
      font-size: 11px;
      font-weight: 500;
      background: transparent;
      border: 1px solid var(--accent-primary);
      color: var(--accent-primary);
      cursor: pointer;
    }
    .file-action:hover,
    .view-button:hover {
      background: rgba(0, 217, 204, 0.12);
    }
    .card-title {
        color: white;
        font-weight: 600;
        font-size: 16px;
    }
    .btn-primary,
    .resolve-dispute-button,
    .submit-button,
    .outcome-submit-button {
        background: var(--accent-primary);
        border-color: var(--accent-primary);
        color: #000000;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
    }
    .btn-primary:hover,
    .resolve-dispute-button:hover,
    .submit-button:hover,
    .outcome-submit-button:hover {
        background: var(--accent-hover);
        border-color: var(--accent-hover);
    }
    .btn-secondary {
        background-color: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.2);
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
    }
    .fade-in {
        animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisputeDetailComponent { }
