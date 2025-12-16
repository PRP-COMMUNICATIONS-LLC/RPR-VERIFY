/**
 * EscalationService Unit Tests
 * Purpose: Validates escalation case management and API integration
 * Framework: Vitest with HttpClientTestingModule
 * Date: December 16, 2025 - Fixed HttpClient mocks and AuthService integration
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EscalationService } from './escalation.service';
import { AuthService } from './auth.service';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

describe('EscalationService', () => {
  let service: EscalationService;
  let httpMock: HttpTestingController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(() => {
    // Mock AuthService to return a test token
    mockAuthService = {
      getCurrentUserToken: vi.fn().mockResolvedValue('mock-firebase-token-123'),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EscalationService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    service = TestBed.inject(EscalationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no outstanding HTTP requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch escalation status with auth token', (done) => {
    const reportId = 'test-report-123';
    const mockResponse = {
      report_id: reportId,
      escalation_state: 'PENDING',
      escalated_at: '2025-12-16T10:00:00Z',
      escalation_reason: 'Low quality document',
    };

    service.getStatus(reportId).subscribe((state) => {
      expect(state).toBeTruthy();
      expect(state.reportId).toBe(reportId);
      expect(state.escalationState).toBe('PENDING');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/escalation/status/${reportId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-firebase-token-123');
    req.flush(mockResponse);
  });

  it('should trigger escalation with metadata', (done) => {
    const reportId = 'test-report-456';
    const metadata = { reason: 'Document mismatch', severity: 'HIGH' };
    const mockResponse = {
      escalation_id: 'esc-789',
      report_id: reportId,
      status: 'TRIGGERED',
      created_at: '2025-12-16T11:00:00Z',
    };

    service.trigger(reportId, metadata).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.escalationId).toBe('esc-789');
      expect(response.status).toBe('TRIGGERED');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/escalation/trigger`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ reportId, metadata });
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-firebase-token-123');
    req.flush(mockResponse);
  });

  it('should resolve escalation with resolution note', (done) => {
    const reportId = 'test-report-789';
    const resolutionNote = 'Document verified manually by agent';
    const mockResponse = {
      updated_state: {
        report_id: reportId,
        escalation_state: 'RESOLVED',
        resolved_at: '2025-12-16T12:00:00Z',
        resolution_note: resolutionNote,
      },
    };

    service.resolve(reportId, resolutionNote).subscribe((state) => {
      expect(state).toBeTruthy();
      expect(state.reportId).toBe(reportId);
      expect(state.escalationState).toBe('RESOLVED');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/escalation/resolve`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ reportId, resolutionNote });
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-firebase-token-123');
    req.flush(mockResponse);
  });

  it('should handle API errors gracefully', (done) => {
    const reportId = 'invalid-report';
    const errorMessage = 'Report not found';

    service.getStatus(reportId).subscribe({
      next: () => {
        // Should not reach here
        expect(false).toBe(true);
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.status).toBe(404);
        done();
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/escalation/status/${reportId}`);
    req.flush({ error: errorMessage }, { status: 404, statusText: 'Not Found' });
  });

  it('should map snake_case keys to camelCase', (done) => {
    const reportId = 'test-report-camel';
    const mockResponse = {
      report_id: reportId,
      escalation_state: 'PENDING',
      escalated_at: '2025-12-16T10:00:00Z',
      escalation_reason: 'Test reason',
      created_by: 'agent-123',
    };

    service.getStatus(reportId).subscribe((state) => {
      // Verify camelCase conversion
      expect(state.reportId).toBe(reportId);
      expect(state.escalationState).toBe('PENDING');
      expect(state.escalatedAt).toBe('2025-12-16T10:00:00Z');
      expect(state.escalationReason).toBe('Test reason');
      expect(state.createdBy).toBe('agent-123');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/escalation/status/${reportId}`);
    req.flush(mockResponse);
  });

  it('should send auth token in all requests', (done) => {
    const reportId = 'auth-test-report';

    service.getStatus(reportId).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/escalation/status')
    );

    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toContain('Bearer ');
    req.flush({ report_id: reportId, escalation_state: 'PENDING' });
  });

  it('should handle AuthService token retrieval failure', (done) => {
    // Override mock to return empty token
    mockAuthService.getCurrentUserToken = vi.fn().mockResolvedValue('');

    const reportId = 'no-auth-report';

    service.getStatus(reportId).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/escalation/status/${reportId}`);
    
    // Should still make request but without Authorization header
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({ report_id: reportId, escalation_state: 'PENDING' });
  });
});
