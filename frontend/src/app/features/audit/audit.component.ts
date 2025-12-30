import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisionService, AuditResponse } from '../../core/services/vision.service';
import { AuditResultComponent } from '../audit-result/audit-result.component';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, AuditResultComponent],
  template: `
    <div style="padding: 20px; color: white;">
      <h2>Forensic Audit</h2>
      <input type="file" (change)="onFileSelected($event)" accept="image/*">

      <app-audit-result [auditResult]="auditResult"></app-audit-result>
    </div>
  `,
  styleUrls: ['./audit.component.css']
})
export class AuditComponent {
  private visionService = inject(VisionService);

  public auditResult: AuditResponse | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        // Using a placeholder reportId as the UI doesn't have one yet.
        this.visionService.auditImage(base64Image, 'AUDIT-COMPONENT-TEST').subscribe(result => {
          this.auditResult = result;
        });
      };
      reader.readAsDataURL(file);
    }
  }
}