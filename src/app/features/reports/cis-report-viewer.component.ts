import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-cis-report-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cis-report-viewer.component.html',
  styleUrls: ['./cis-report-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CisReportViewerComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private reportService = inject(ReportService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  reportHtml: SafeHtml = '';
  caseId: string = '';
  loading = false;
  downloadingPdf: boolean = false;
  error: string = '';

  ngOnInit(): void {
    console.log('🔵 CisReportViewerComponent: ngOnInit called');
    this.caseId = this.route.snapshot.paramMap.get('id') || '';
    console.log('🔵 Extracted caseId:', this.caseId);

    if (this.caseId) {
      console.log('🔵 Calling loadReport()...');
      this.loadReport();
    } else {
      console.error('❌ No case ID found in route');
      this.error = 'No case ID provided';
    }
  }

  loadReport(): void {
    console.log('🔵 loadReport() called with caseId:', this.caseId);
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck(); // Mark for check for loading state

    this.reportService.getCisReport(this.caseId).subscribe({
      next: (response) => {
        console.log('✅ Report response received:', response);
        console.log('🔍 Response keys:', Object.keys(response));
        console.log('🔍 Full response:', JSON.stringify(response, null, 2));

        // Handle multiple possible field names for compatibility
        const htmlContent = (response as any).html_content ||
          (response as any).summary_html ||
          response.summary_text;

        console.log('🔍 htmlContent value:', htmlContent ? `Length: ${htmlContent.length}` : 'UNDEFINED');

        if (htmlContent) {
          console.log('✅ HTML content found, length:', htmlContent.length);
          this.reportHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
          console.log('✅ HTML sanitized and assigned');
        } else {
          console.error('❌ No HTML content found in response');
          console.error('❌ Response structure:', response);
          this.error = 'No report data available';
        }

        this.loading = false;
        this.cdr.markForCheck(); // Mark for check after update
        console.log('🔵 Loading set to false, change detection triggered');
      },
      error: (err) => {
        console.error('❌ Report error:', err);
        console.error('❌ Error details:', err.error || err.message);
        this.error = 'Failed to load report. Please try again.';
        this.loading = false;
        this.cdr.markForCheck(); // Mark for check on error
        console.log('🔵 Error handled, loading set to false');
      }
    });
  }

  downloadPdf(): void {
    if (!this.caseId) return;

    console.log('⬇️ Initiating server-side PDF download...');
    this.downloadingPdf = true; // Set loading state if you have this property, otherwise just log

    this.reportService.downloadCisReportPdf(this.caseId).subscribe({
      next: (blob: Blob) => {
        console.log('✅ PDF Blob received, size:', blob.size);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CIS_Report_${this.caseId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloadingPdf = false;
      },
      error: (err) => {
        console.error('❌ PDF Download failed:', err);
        alert('Failed to download PDF. Please try again.'); // Simple alert for now as requested by user context implies quick fix
        this.downloadingPdf = false;
      }
    });
  }

  reload(): void {
    this.loadReport();
  }
}

