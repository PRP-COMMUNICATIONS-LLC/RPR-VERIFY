"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupToDrive = backupToDrive;
const googleapis_1 = require("googleapis");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// CONFIGURATION: RPR-VERIFY-LOGS (Secure Air Gap)
const TARGET_FOLDER_ID = '1l2LU8YCIE3cVkHNxYpnbHD36xPq1mgUK';
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../service-account-key.json');
/**
 * AUTHENTICATION
 * Uses the Service Account key you placed in the 'functions' folder.
 */
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});
/**
 * UPLOAD FUNCTION
 * Pushes a JSON status summary to your secure Drive folder.
 */
async function backupToDrive(filename, jsonData) {
    const drive = googleapis_1.google.drive({ version: 'v3', auth });
    const tempPath = path.join('/tmp', filename);
    // Ensure /tmp exists (local dev safety)
    if (!fs.existsSync('/tmp'))
        fs.mkdirSync('/tmp');
    fs.writeFileSync(tempPath, JSON.stringify(jsonData, null, 2));
    try {
        const fileMetadata = {
            name: filename,
            parents: [TARGET_FOLDER_ID],
        };
        const media = {
            mimeType: 'application/json',
            body: fs.createReadStream(tempPath),
        };
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id',
        });
        console.log(`✅ [Backup Success] File Id: ${response.data.id}`);
        return response.data.id;
    }
    catch (error) {
        console.error('❌ [Backup Failed] Drive API Error:', error);
        throw error;
    }
    finally {
        if (fs.existsSync(tempPath))
            fs.unlinkSync(tempPath);
    }
}
//# sourceMappingURL=google-drive-backup.js.map