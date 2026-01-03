/**
 * Firebase Cloud Functions Entry Point
 * 
 * This file exports all Cloud Functions for deployment.
 * Currently, functions are being set up for RPR-VERIFY.
 */

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import cors from 'cors';

import axios from 'axios';

// Explicitly setting the region to asia-southeast1 for all functions
setGlobalOptions({ region: 'asia-southeast1' });

// CORS configuration
const corsOptions = {
  origin: [
    'https://verify.rprcomms.com',
    'https://www.rprcomms.com',
    'http://localhost:4200', // For local development
    'https://rpr-verify-b.web.app' // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
};

// CORS middleware wrapper
const corsHandler = cors(corsOptions);

// Helper to wrap functions with CORS
function withCors(handler: (req: any, res: any) => void | Promise<void>) {
  return onRequest({
    invoker: 'public',
    cors: true
  }, (request, response) => {
    corsHandler(request, response, () => {
      handler(request, response);
    });
  });
}

// Hardened Proxy function for CIS Reports - Locked to Singapore Node
export const cisReportApi = onRequest({
  region: 'asia-southeast1',
  invoker: 'public',
  cors: true,
  maxInstances: 10,
  minInstances: 1,
  concurrency: 80,
  memory: '512MiB',
}, async (request, response) => {
  // Fixes the 405 Method Not Allowed error
  if (request.method !== 'POST' && request.method !== 'OPTIONS') {
    response.status(405).json({
      error: 'Method Not Allowed',
      message: 'Phase 4 requires POST for document processing',
      received: request.method
    });
    return;
  }

  if (request.method === 'OPTIONS') {
    response.status(204).send();
    return;
  }

  try {
    const { case_id } = request.body;

    // Phase 4 Forensic Bridge: Placeholder signal with real metadata residency
    // In final state, this calls the vision_engine.py logic on Cloud Run
    response.status(200).json({
      status: 'success',
      case_id: case_id || 'UNKNOWN',
      risk_status: 'GREEN',
      forensic_metadata: {
        region: 'asia-southeast1',
        timestamp: new Date().toISOString(),
        model_version: 'gemini-1.5-flash',
        node: 'ASIA-SOUTHEAST1-SGP'
      },
      data: {
        message: 'Forensic extraction bridge active'
      }
    });
  } catch (error: any) {
    console.error('Proxy Error:', error.message);
    response.status(500).json({
      error: 'Internal Forensic Error',
      details: error.message,
      phase: 'Phase 4 - Singapore Node'
    });
  }
});
