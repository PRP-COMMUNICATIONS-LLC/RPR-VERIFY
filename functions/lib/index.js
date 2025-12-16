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
exports.helloWorld = void 0;
const functions = __importStar(require("firebase-functions"));
const cors_1 = __importDefault(require("cors"));
// CORS configuration
const corsOptions = {
    origin: [
        'https://verify.rprcomms.com',
        'https://www.rprcomms.com',
        'http://localhost:4200', // For local development
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
// Placeholder for future Cloud Functions
// Add your functions here as you develop them
exports.helloWorld = withCors((request, response) => {
    response.json({ message: 'RPR-VERIFY Functions API is running' });
});
//# sourceMappingURL=index.js.map