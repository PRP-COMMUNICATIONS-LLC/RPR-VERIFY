#!/bin/bash
# File: scripts/04_frontend_implementation.sh
# Description: Update Angular frontend files

set -e

echo "🎨 PHASE 4: Frontend Implementation"
echo "===================================="

cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

echo "📝 Step 4.1: Update report.service.ts"
cat > src/app/core/services/report.service.ts << 'EOF'
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CisReportResponse {
  status: string;
  case_id: string;
  summary_text: string;
  summary_html?: string;
  html_content?: string;
  sections: any;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://localhost:8080';

  getCisReport(caseId: string): Observable<CisReportResponse> {
    console.log('🔵 ReportService.getCisReport() called');
    const url = `${this.apiUrl}/api/reports/cis/${caseId}`;
    return this.http.get<CisReportResponse>(url);
  }

  downloadCisReportPdf(caseId: string): Observable<Blob> {
    console.log('🔵 ReportService.downloadCisReportPdf() called for case:', caseId);
    const url = `${this.apiUrl}/api/reports/cis/${caseId}?format=pdf`;
    
    return this.http.get(url, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }
}
EOF

echo "📝 Step 4.2: Update cis-report-viewer.component.ts"
cat > src/app/features/reports/cis-report-viewer.component.ts << 'EOF'
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-cis-report-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cis-report-viewer.component.html',
  styleUrls: ['./cis-report-viewer.component.css']
})
export class CisReportViewerComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private reportService = inject(ReportService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  reportHtml: SafeHtml = '';
  caseId: string = '';
  loading = false;
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
    this.cdr.detectChanges(); // Force change detection for loading state

    this.reportService.getCisReport(this.caseId).subscribe({
      next: (response) => {
        console.log('✅ Report response received:', response);

        // Handle multiple possible field names for compatibility
        const htmlContent = (response as any).html_content ||
          (response as any).summary_html ||
          response.summary_text;

        if (htmlContent) {
          this.reportHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
        } else {
          console.error('❌ No HTML content found in response');
          this.error = 'No report data available';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Report error:', err);
        this.error = 'Failed to load report. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadPdf(): void {
    if (!this.caseId) return;

    console.log('⬇️ Initiating server-side PDF download...');
    
    // Use the ReportService to fetch the PDF blob
    this.reportService.downloadCisReportPdf(this.caseId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CIS_Report_${this.caseId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        console.log('✅ PDF downloaded successfully');
      },
      error: (err) => {
        console.error('❌ PDF download failed:', err);
        this.error = 'Failed to download PDF. Please try again.';
      }
    });
  }

  reload(): void {
    this.loadReport();
  }
}
EOF

echo "✅ PHASE 4 COMPLETE: Frontend files updated"
echo ""
echo "Next: Run scripts/05_local_e2e_test.sh"
