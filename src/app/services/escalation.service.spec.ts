import { TestBed } from '@angular/core/testing';
import { EscalationService } from './escalation.service';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('EscalationService', () => {
  let service: EscalationService;
  let httpMock: HttpTestingController;

  const authServiceMock = {
    getCurrentUserToken: vi.fn().mockResolvedValue('mock-token-123'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EscalationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
    service = TestBed.inject(EscalationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch escalation status', () => {
    const reportId = 'test-123';
    const mockData = { status: 'PENDING' };

    // No done() callback needed; HttpTestingController makes this synchronous
    service.getStatus(reportId).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/escalation/status/${reportId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should upload slip (create escalation)', () => {
    const reportId = 'ref-123';
    const file = new File([''], 'test.png');
    
    // RENAMED from .trigger() to .uploadSlip() based on your architecture
    service.uploadSlip(reportId, file).subscribe(res => {
       expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/storage/upload/${reportId}`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });
});
