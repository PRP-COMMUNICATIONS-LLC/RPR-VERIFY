import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { SecureUploadComponent } from './secure-upload.component';
import { EscalationService } from '../../services/escalation.service';

describe('SecureUploadComponent', () => {
  let component: SecureUploadComponent;
  let fixture: ComponentFixture<SecureUploadComponent>;
  let escalationService: EscalationService;

  beforeEach(async () => {
    // Vitest-compatible mock of EscalationService
    escalationService = {
      scanSlipWithMetadata: vi.fn().mockReturnValue(of({ 
        success: true,
        risk_level: 0,
        matchScore: 100,
        riskMarker: 0,
        extractedMetadata: {}
      })),
      scanSlip: vi.fn().mockReturnValue(of({ success: true })),
      createJob: vi.fn().mockReturnValue(of(void 0)),
      uploadFile: vi.fn().mockReturnValue(of({ status: 'success', message: 'Upload complete' })),
    } as Partial<EscalationService> as EscalationService;

    await TestBed.configureTestingModule({
      imports: [SecureUploadComponent, FormsModule],
      providers: [{ provide: EscalationService, useValue: escalationService }],
    })
      // Critical: override template BEFORE Angular processes templateUrl
      .overrideTemplate(SecureUploadComponent, '<div>Mock Template</div>')
      .compileComponents();

    await TestBed.resolveComponentResources();

    fixture = TestBed.createComponent(SecureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with IDLE status', () => {
    expect(component.uploadStatus()).toBe('IDLE');
  });

  it('should handle file selection', () => {
    const file = new File(['x'], 'test.pdf', { type: 'application/pdf' });
    component.onFileSelected({ target: { files: [file] } } as any);
    expect(component.selectedFile()).toBe(file);
    expect(component.uploadStatus()).toBe('IDLE');
  });

  it('should simulate secure upload', fakeAsync(async () => {
    const file = new File(['x'], 'test.pdf', { type: 'application/pdf' });
    component.onFileSelected({ target: { files: [file] } } as any);

    const uploadPromise = component.startSecureUpload();
    expect(component.isUploading()).toBe(true);
    expect(component.uploadStatus()).toBe('UPLOADING');

    // Wait for async operation to complete
    await uploadPromise;
    tick(1000);

    expect(component.isUploading()).toBe(false);
    expect(component.uploadStatus()).toBe('SUCCESS');
  }));

  it('should reset state', () => {
    component.uploadStatus.set('SUCCESS');
    component.isUploading.set(true);
    component.selectedFile.set(new File([], 'test.txt'));

    component.reset();

    expect(component.uploadStatus()).toBe('IDLE');
    expect(component.isUploading()).toBe(false);
    expect(component.selectedFile()).toBeNull();
  });
});
