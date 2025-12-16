import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, map, switchMap } from 'rxjs';
import {
  EscalationState,
  EscalationRowUI,
  mapApiStateToRowUI
} from '../../models/escalation';
import { EscalationService } from '../../services/escalation.service';
import { DocumentQualityAnalyzer, AnalysisResult } from '../../utils/document-quality-analyzer';
import { StatusIndicatorComponent } from '../../shared/status-indicator/status-indicator.component';


@Component({
  selector: 'app-escalation-dashboard',
  standalone: true,
  imports: [CommonModule, StatusIndicatorComponent],
  templateUrl: './escalation-dashboard.component.html',
  styleUrls: ['./escalation-dashboard.component.css']
})
export class EscalationDashboardComponent implements OnInit {
  // Signals for reactive UI state
  reports = signal<EscalationRowUI[]>([]);
  isLoading = signal(true);
  errorState = signal<string | null>(null);

  // initial list of report IDs to display (replaces previous mock rows)
  private initialReportIds = [
    'RPR-2025-0001',
    'RPR-2025-0002',
    'RPR-2025-0003',
    'RPR-2025-0004',
  ];

  private analyzer = new DocumentQualityAnalyzer();
  private escalationService = inject(EscalationService);

  ngOnInit(): void {
    this.loadEscalationData();
  }

  private enrichWithQuality(base: EscalationRowUI, analysis: AnalysisResult): EscalationRowUI {
    const score = DocumentQualityAnalyzer.computeQualityScore(analysis);

    let primaryQualityIssue: 'Blur' | 'Rotation' | 'None' = 'None';
    // Use thresholds consistent with DocumentQualityAnalyzer implementation
    if (analysis.blurScore < 10) {
      primaryQualityIssue = 'Blur';
    } else if (Math.abs(analysis.rotationDegrees) > 2) {
      primaryQualityIssue = 'Rotation';
    }

    let qualityStatus: 'Good' | 'Fair' | 'Poor' = 'Good';
    if (score < 50) qualityStatus = 'Poor';
    else if (score < 80) qualityStatus = 'Fair';

    return {
      ...base,
      qualityScore: score,
      primaryQualityIssue,
      qualityAnalysisRuntime: analysis.runtimeMs,
      qualityStatus,
    };
  }

  loadEscalationData(): void {
    this.isLoading.set(true);
    this.errorState.set(null);

    const statusObservables = this.initialReportIds.map(id => this.escalationService.getStatus(id));

    forkJoin(statusObservables).pipe(
      switchMap((states: EscalationState[]) => {
        const enrichers = states.map((s) => {
          // Start from the model mapper to ensure all required model fields exist,
          // then extend with UI quality fields.
          const baseModel = mapApiStateToRowUI(s);
          const baseUi: EscalationRowUI = {
            ...baseModel,
            qualityScore: 100,
            primaryQualityIssue: 'None',
            qualityAnalysisRuntime: 0,
            qualityStatus: 'Good',
          };

          return this.analyzer.analyze(DocumentQualityAnalyzer.getMockImageData()).pipe(
            map((analysis: AnalysisResult) => this.enrichWithQuality(baseUi, analysis))
          );
        });

        return forkJoin(enrichers);
      })
    ).subscribe({
      next: (enrichedRows: EscalationRowUI[]) => {
        this.reports.set(enrichedRows);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load escalation data or run analyses', err);
        this.isLoading.set(false);
        this.errorState.set(err && (err as Error).message ? (err as Error).message : String(err));
      }
    });
  }


  onResolve(row: EscalationRowUI) {
    if (row.status === 'RESOLVED') return;

    const note = 'Resolved via dashboard UI';
    this.escalationService.resolve(row.id, note).subscribe({
        next: (updatedState: EscalationState) => {
        // Re-run local analysis to refresh quality metadata for the resolved report
        this.analyzer.analyze(DocumentQualityAnalyzer.getMockImageData()).subscribe({
          next: (analysis: AnalysisResult) => {
            // Build a local UI row from the updatedState
const baseUi: EscalationRowUI = {
              ...mapApiStateToRowUI(updatedState),
              qualityScore: 100,
              primaryQualityIssue: 'None',
              qualityAnalysisRuntime: 0,
              qualityStatus: 'Good',
            };

            const qualityScore = DocumentQualityAnalyzer.computeQualityScore(analysis);
            const primaryIssue = analysis.isBlurry ? 'Blur' : analysis.isRotated ? 'Rotation' : 'None';
            const qualityStatus = qualityScore > 85 ? 'Good' : qualityScore > 60 ? 'Fair' : 'Poor';

            const updatedRow: EscalationRowUI = {
              ...baseUi,
              qualityScore,
              primaryQualityIssue: primaryIssue,
              qualityAnalysisRuntime: analysis.runtimeMs,
              qualityStatus,
            };

            this.reports.update((list: EscalationRowUI[]) => list.map((r: EscalationRowUI) => r.id === updatedRow.id ? updatedRow : r));
          },
          error: (err: unknown) => {
            console.error('Failed to run analysis after resolve', err);
            // preserve existing UI state
          }
        });
      },
      error: (err) => {
        console.error('Failed to resolve escalation', err);
        this.errorState.set(err?.message ? String(err.message) : String(err));
      }
    });
  }
}
