/**
 * Firebase Cloud Functions Entry Point
 * 
 * This file exports all Cloud Functions for deployment.
 * Currently, functions are being set up for RPR-VERIFY.
 */

import * as functions from 'firebase-functions';
import cors from 'cors';

import axios from 'axios';

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
function withCors(handler: (req: functions.Request, res: functions.Response) => void | Promise<void>) {
  return functions
    .region('asia-southeast1') // FIX: Explicitly set region to asia-southeast1 for the Singapore Engine
    .https.onRequest((request, response) => {
      corsHandler(request, response, () => {
        handler(request, response);
      });
    });
}

// Proxy function for CIS Reports
export const cisReportApi = withCors(async (request, response) => {
  try {
    const backendUrl = 'https://rpr-verify-794095666194.asia-southeast1.run.app';
    // Ensure path starts with /api if not present in request.path (Firebase sometimes strips it or passes full path)
    // The rewrite is /api/** -> function. request.path should be the full path.
    const url = `${backendUrl}${request.path}`;

    console.log(`Proxying request to: ${url}`);

    const axiosResponse = await axios({
      method: request.method,
      url: url,
      data: request.body,
      // Minimal header forwarding to avoid conflicts
      headers: {
        'Content-Type': request.headers['content-type'] || 'application/json',
        'Authorization': request.headers['authorization'],
      },
      responseType: 'arraybuffer', // Support PDFs
      validateStatus: () => true // Handle 4xx/5xx manually
    });

    // Forward headers from backend
    Object.entries(axiosResponse.headers).forEach(([key, value]) => {
      if (value) response.setHeader(key, value as string);
    });

    response.status(axiosResponse.status).send(axiosResponse.data);

  } catch (error: any) {
    console.error('Proxy Error:', error.message);
    response.status(500).json({
      error: 'Proxy Error',
      details: error.message
    });
  }
});
