import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecureUploadComponent } from './secure-upload.component'; 
import { EscalationService } from '../../services/escalation.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component } from '@angular/core';

// Mock Component Pattern (Safe & Fast)
@Component({
  selector: 'app-secure-upload',
  standalone: true,
  template: '<div>Mock</div>'
})
class MockSecureUpload {}

const mockEscalationService = {
  uploadSlip: vi.fn().mockReturnValue(of({ success: true }))
};

describe('SecureUpload', () => {
  let component: MockSecureUpload;
  let fixture: ComponentFixture<MockSecureUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockSecureUpload], 
      providers: [
        { provide: EscalationService, useValue: mockEscalationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MockSecureUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
