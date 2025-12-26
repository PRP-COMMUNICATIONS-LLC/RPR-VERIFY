/**
 * Mock Document Utility for RPR-VERIFY Test Suite
 * Purpose: Standardized test data generation for unit and integration tests
 * Date: December 16, 2025
 */

import { InjectionToken } from '@angular/core';

// ============================================================================
// Type Definitions
// ============================================================================

export type DocumentType = 'drivers-license' | 'passport' | 'bank-statement' | 'abn';
export type QualityLevel = 'good' | 'poor' | 'blurry';
export type RiskSeverity = 'GREEN' | 'YELLOW' | 'RED';

export interface MockDocumentOptions {
  type: DocumentType;
  quality?: QualityLevel;
  confidence?: number; // 0-100
  dpi?: number;
  hasRedFlags?: boolean;
  filename?: string;
}

export interface DocumentQualityMetrics {
  dpi: number;
  contrast: number;
  blurScore: number;
  hasWarnings: boolean;
}

export interface OCRResult {
  confidence: number;
  extractedText: string;
  structuredData?: Record<string, string>;
}

export interface RiskAssessment {
  severity: RiskSeverity;
  flags: string[];
  score: number; // 0-100
}

export interface MockDocument {
  id: string;
  type: DocumentType;
  filename: string;
  uploadedAt: Date;
  quality: DocumentQualityMetrics;
  ocrResult: OCRResult;
  riskAssessment: RiskAssessment;
}

// ============================================================================
// Mock Data Generators
// ============================================================================

/**
 * Creates a mock document with configurable quality and risk parameters
 * @param options Configuration for the mock document
 * @returns MockDocument object ready for test assertions
 */
export function createMockDocument(options: MockDocumentOptions): MockDocument {
  const timestamp = Date.now();
  const qualityPresets = getQualityPresets(options.quality || 'good');
  
  return {
    id: `mock-${options.type}-${timestamp}`,
    type: options.type,
    filename: options.filename || `${options.type}-sample.jpg`,
    uploadedAt: new Date(),
    quality: {
      dpi: options.dpi ?? qualityPresets.dpi,
      contrast: qualityPresets.contrast,
      blurScore: qualityPresets.blurScore,
      hasWarnings: (options.dpi ?? qualityPresets.dpi) < 150,
    },
    ocrResult: {
      confidence: options.confidence ?? qualityPresets.ocrConfidence,
      extractedText: generateSampleText(options.type),
      structuredData: generateStructuredData(options.type),
    },
    riskAssessment: {
      severity: options.hasRedFlags ? 'RED' : qualityPresets.riskSeverity,
      flags: options.hasRedFlags ? ['Document mismatch detected', 'Low confidence score'] : [],
      score: options.hasRedFlags ? 35 : 92,
    },
  };
}

/**
 * Generates an array of mock documents for batch testing
 * @param count Number of documents to generate
 * @param baseOptions Base configuration applied to all documents
 * @returns Array of MockDocument objects
 */
export function createMockDocumentBatch(
  count: number,
  baseOptions: Partial<MockDocumentOptions> = {}
): MockDocument[] {
  const types: DocumentType[] = ['drivers-license', 'passport', 'bank-statement', 'abn'];
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    return createMockDocument({ type, ...baseOptions });
  });
}

// ============================================================================
// Quality Presets
// ============================================================================

interface QualityPreset {
  dpi: number;
  contrast: number;
  blurScore: number;
  ocrConfidence: number;
  riskSeverity: RiskSeverity;
}

function getQualityPresets(quality: QualityLevel): QualityPreset {
  const presets: Record<QualityLevel, QualityPreset> = {
    good: {
      dpi: 300,
      contrast: 0.85,
      blurScore: 220,
      ocrConfidence: 95,
      riskSeverity: 'GREEN',
    },
    poor: {
      dpi: 120,
      contrast: 0.35,
      blurScore: 150,
      ocrConfidence: 68,
      riskSeverity: 'YELLOW',
    },
    blurry: {
      dpi: 180,
      contrast: 0.50,
      blurScore: 45,
      ocrConfidence: 52,
      riskSeverity: 'YELLOW',
    },
  };
  return presets[quality];
}

// ============================================================================
// Sample Data Generators
// ============================================================================

function generateSampleText(type: DocumentType): string {
  const samples: Record<DocumentType, string> = {
    'drivers-license': 'DRIVER LICENSE\nNAME: John Smith\nLICENSE NO: D1234567\nEXPIRES: 2026-12-31',
    'passport': 'PASSPORT\nSurname: SMITH\nGiven Names: JOHN ROBERT\nNationality: AUSTRALIAN\nPassport No: N1234567',
    'bank-statement': 'COMMONWEALTH BANK\nAccount Statement\nAccount Holder: John Smith\nBSB: 062-000\nAccount: 12345678',
    'abn': 'AUSTRALIAN BUSINESS NUMBER\nABN: 12 345 678 901\nEntity Name: SMITH ENTERPRISES PTY LTD\nStatus: Active',
  };
  return samples[type];
}

function generateStructuredData(type: DocumentType): Record<string, string> {
  const data: Record<DocumentType, Record<string, string>> = {
    'drivers-license': {
      fullName: 'John Smith',
      licenseNumber: 'D1234567',
      expiryDate: '2026-12-31',
      state: 'NSW',
    },
    'passport': {
      surname: 'SMITH',
      givenNames: 'JOHN ROBERT',
      passportNumber: 'N1234567',
      nationality: 'AUSTRALIAN',
    },
    'bank-statement': {
      accountHolder: 'John Smith',
      bsb: '062-000',
      accountNumber: '12345678',
      institution: 'Commonwealth Bank',
    },
    'abn': {
      abn: '12 345 678 901',
      entityName: 'SMITH ENTERPRISES PTY LTD',
      status: 'Active',
    },
  };
  return data[type];
}

// ============================================================================
// Firebase Auth Mocks
// ============================================================================

export interface MockFirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  photoURL?: string;
  getIdToken: () => Promise<string>;
}

export const MOCK_FIREBASE_USER: MockFirebaseUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  photoURL: 'https://via.placeholder.com/150',
  getIdToken: async () => 'mock-firebase-token-' + Date.now(),
};

export const MOCK_FIREBASE_USER_UNVERIFIED: MockFirebaseUser = {
  ...MOCK_FIREBASE_USER,
  uid: 'test-user-unverified',
  emailVerified: false,
};

// ============================================================================
// Router Mocks
// ============================================================================

export const MOCK_ACTIVATED_ROUTE = {
  snapshot: {
    paramMap: {
      get: (key: string) => {
        const params: Record<string, string> = {
          id: 'mock-case-123',
          documentId: 'mock-doc-456',
        };
        return params[key] || null;
      },
    },
    queryParamMap: {
      get: (key: string) => {
        const queryParams: Record<string, string> = {
          view: 'detail',
          tab: 'documents',
        };
        return queryParams[key] || null;
      },
    },
  },
};

// ============================================================================
// HTTP Response Mocks
// ============================================================================

export interface MockAPIResponse<T = unknown> {
  status: number;
  data: T;
  message?: string;
}

export function createMockAPIResponse<T>(
  data: T,
  status = 200,
  message?: string
): MockAPIResponse<T> {
  return { status, data, message };
}

export const MOCK_API_ERROR_RESPONSE: MockAPIResponse = {
  status: 500,
  data: null,
  message: 'Internal server error',
};

export const MOCK_API_UNAUTHORIZED_RESPONSE: MockAPIResponse = {
  status: 401,
  data: null,
  message: 'Unauthorized: Invalid or missing token',
};

// ============================================================================
// Test Utilities
// ============================================================================

/**
 * Creates a mock File object for upload testing
 * @param filename Name of the file
 * @param type MIME type
 * @param size File size in bytes
 * @returns File object
 */
export function createMockFile(
  filename = 'test-document.jpg',
  type = 'image/jpeg',
  size = 1024 * 500 // 500KB
): File {
  const blob = new Blob(['x'.repeat(size)], { type });
  return new File([blob], filename, { type });
}

/**
 * Creates a mock FileList for multi-file upload testing
 * @param files Array of File objects
 * @returns FileList-like object
 */
export function createMockFileList(files: File[]): FileList {
  const fileList: FileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      for (const file of files) {
        yield file;
      }
    },
  } as FileList;

  // Add indexed properties
  files.forEach((file, index) => {
    (fileList as unknown as Record<number, File>)[index] = file;
  });

  return fileList;
}

/**
 * Delays execution for testing async operations
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
