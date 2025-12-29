"use strict";
/**
 * Firebase Cloud Functions Entry Point
 *
 * This file exports all Cloud Functions for deployment.
 * Currently, functions are being set up for RPR-VERIFY.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cisReportApi = void 0;
const functions = __importStar(require("firebase-functions"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
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
    return functions.https.onRequest((request, response) => {
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