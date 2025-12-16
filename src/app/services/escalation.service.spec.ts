/**
 * EscalationService Unit Tests
 * Purpose: Validates escalation case management and API integration
 * Framework: Vitest with HttpClient mocks
 * Date: December 16, 2025
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EscalationService } from './escalation.service';
import { createMockDocument, createMockAPIResponse } from '../../testing/createMockDocument';

describe('EscalationService', () => {
  let service: EscalationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EscalationService],
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

  it('should fetch escalation cases from API', (done) => {
    const mockCases = [
      { id: 'case-1', status: 'PENDING', documentId: 'doc-1' },
      { id: 'case-2', status: 'RESOLVED', documentId: 'doc-2' },
    ];

    service.getCases().subscribe((cases) => {
      expect(cases).toEqual(mockCases);
      expect(cases).toHaveLength(2);
      done();
    });

    const req = httpMock.expectOne((request) => request.url.includes('/escalations'));
    expect(req.request.method).toBe('GET');
    req.flush(createMockAPIResponse(mockCases));
  });

  it('should create new escalation case', (done) => {
    const mockDocument = createMockDocument({
      type: 'drivers-license',
      hasRedFlags: true,
    });

    const newCase = {
      documentId: mockDocument.id,
      severity: 'HIGH',
      reason: 'Document quality below threshold',
    };

    service.createCase(newCase).subscribe((response) => {
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      done();
    });

    const req = httpMock.expectOne((request) => request.url.includes('/escalations'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCase);
    req.flush(createMockAPIResponse({ id: 'case-123', ...newCase }, 201));
  });

  it('should handle API errors gracefully', (done) => {
    service.getCases().subscribe({
      next: () => {
        // Should not reach here
        expect(false).toBe(true);
      },
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      },
    });

    const req = httpMock.expectOne((request) => request.url.includes('/escalations'));
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should update case status', (done) => {
    const caseId = 'case-123';
    const newStatus = 'RESOLVED';

    service.updateCaseStatus(caseId, newStatus).subscribe((response) => {
      expect(response.data.status).toBe(newStatus);
      done();
    });

    const req = httpMock.expectOne((request) => request.url.includes(`/escalations/${caseId}`));
    expect(req.request.method).toBe('PATCH');
    req.flush(createMockAPIResponse({ id: caseId, status: newStatus }));
  });

  it('should filter cases by status', (done) => {
    const mockCases = [
      { id: 'case-1', status: 'PENDING' },
      { id: 'case-2', status: 'PENDING' },
    ];

    service.getCasesByStatus('PENDING').subscribe((cases) => {
      expect(cases).toHaveLength(2);
      expect(cases.every((c) => c.status === 'PENDING')).toBe(true);
      done();
    });

    const req = httpMock.expectOne((request) =>
      request.url.includes('/escalations') && request.params.get('status') === 'PENDING'
    );
    req.flush(createMockAPIResponse(mockCases));
  });
});
