import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// CONFIGURATION: RPR-VERIFY-LOGS (Secure Air Gap)
const TARGET_FOLDER_ID = '1l2LU8YCIE3cVkHNxYpnbHD36xPq1mgUK'; 
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../service-account-key.json');

/**
 * AUTHENTICATION
 * Uses the Service Account key you placed in the 'functions' folder.
 */
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_PATH,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

/**
 * UPLOAD FUNCTION
 * Pushes a JSON status summary to your secure Drive folder.
 */
export async function backupToDrive(filename: string, jsonData: any) {
  const drive = google.drive({ version: 'v3', auth });
  
  const tempPath = path.join('/tmp', filename);
  // Ensure /tmp exists (local dev safety)
  if (!fs.existsSync('/tmp')) fs.mkdirSync('/tmp');
  
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

  } catch (error) {
    console.error('❌ [Backup Failed] Drive API Error:', error);
    throw error;
  } finally {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}
