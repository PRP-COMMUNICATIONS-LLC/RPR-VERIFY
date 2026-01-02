"use strict";
/**
 * Firebase Cloud Functions Entry Point
 *
 * This file exports all Cloud Functions for deployment.
 * Currently, functions are being set up for RPR-VERIFY.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cisReportApi = void 0;
const https_1 = require("firebase-functions/v2/https");
const v2_1 = require("firebase-functions/v2");
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
// Explicitly setting the region to asia-southeast1 for all functions
(0, v2_1.setGlobalOptions)({ region: 'asia-southeast1' });
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
const corsHandler = (0, cors_1.default)(corsOptions);
// Helper to wrap functions with CORS
function withCors(handler) {
    return (0, https_1.onRequest)((request, response) => {
        corsHandler(request, response, () => {
            handler(request, response);
        });
    });
}
// Proxy function for CIS Reports
exports.cisReportApi = withCors(async (request, response) => {
    try {
        const backendUrl = 'https://rpr-verify-794095666194.asia-southeast1.run.app';
        // Ensure path starts with /api if not present in request.path (Firebase sometimes strips it or passes full path)
        // The rewrite is /api/** -> function. request.path should be the full path.
        const url = `${backendUrl}${request.path}`;
        console.log(`Proxying request to: ${url}`);
        const axiosResponse = await (0, axios_1.default)({
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
            if (value)
                response.setHeader(key, value);
        });
        response.status(axiosResponse.status).send(axiosResponse.data);
    }
    catch (error) {
        console.error('Proxy Error:', error.message);
        response.status(500).json({
            error: 'Proxy Error',
            details: error.message
        });
    }
});
//# sourceMappingURL=index.js.map