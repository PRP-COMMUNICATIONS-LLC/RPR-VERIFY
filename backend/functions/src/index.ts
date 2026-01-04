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

// CORS configuration for identity extraction endpoint
const corsOptions = {
  origin: [
    'https://verify.rprcomms.com',
    'https://www.rprcomms.com',
    'http://localhost:4200', // For local development
    'https://rpr-verify-b.web.app' // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
};

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

// Identity Extraction Endpoint for Zero-Touch Project Initialization
// Accepts base64-encoded image in request body
export const extractIdentity = onRequest({
  region: 'asia-southeast1',
  invoker: 'public',
  cors: true, // Enable automatic CORS handling - handles OPTIONS preflight automatically
  maxInstances: 10,
  minInstances: 1,
  concurrency: 80,
  memory: '512MiB',
}, async (request, response) => {
  // Handle method validation
  if (request.method !== 'POST' && request.method !== 'OPTIONS') {
    response.status(405).json({
      error: 'Method Not Allowed',
      message: 'Identity extraction requires POST',
      received: request.method
    });
    return;
  }

  // OPTIONS preflight is automatically handled by cors: true
  // But we can return early if needed
  if (request.method === 'OPTIONS') {
    response.status(204).send();
    return;
  }

  try {
      // Accept base64-encoded image from frontend
      const { document_image_base64 } = request.body;
      
      if (!document_image_base64) {
        response.status(400).json({
          error: 'Bad Request',
          message: 'No document_image_base64 provided in request body'
        });
        return;
      }

      // Construct Python Cloud Function URL
      const projectId = process.env.GCLOUD_PROJECT || 'rpr-verify-b';
      const pythonFunctionUrl = `https://asia-southeast1-${projectId}.cloudfunctions.net/extract_identity_python`;
      
      // Call Python Cloud Function via HTTP
      try {
        const pythonResponse = await axios.post(
          pythonFunctionUrl,
          {
            image: document_image_base64
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout for AI processing
          }
        );
        
        // Forward Python function response directly to frontend
        response.status(200).json(pythonResponse.data);
        
      } catch (pythonError: any) {
        // Handle Python function errors
        console.error('Python Function Error:', pythonError.message);
        
        if (pythonError.response) {
          // Python function returned an error response
          response.status(pythonError.response.status || 500).json({
            error: pythonError.response.data?.error || 'Python function error',
            details: pythonError.response.data?.details || pythonError.message
          });
        } else if (pythonError.code === 'ECONNREFUSED' || pythonError.code === 'ETIMEDOUT') {
          // Connection/timeout error
          response.status(503).json({
            error: 'Service Unavailable',
            details: 'Python identity extraction service is not available. Please try again later.'
          });
        } else {
          // Other errors
          response.status(500).json({
            error: 'Internal Server Error',
            details: pythonError.message
          });
        }
      }
      
    } catch (error: any) {
      console.error('Extract Identity Error:', error.message);
      response.status(500).json({
        error: 'Internal Server Error',
        details: error.message
      });
    }
  } catch (error: any) {
    console.error('Extract Identity Error:', error.message);
    response.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});
