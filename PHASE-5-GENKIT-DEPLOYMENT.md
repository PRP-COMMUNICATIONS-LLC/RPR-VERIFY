# PHASE 5: AGENT DEPLOYMENT - GENKIT SIDECAR SETUP

**Date:** December 11, 2025  
**Status:** Ready for Immediate Execution  
**Scope:** Deploy "Corporate Librarian" + "Drive Backup" infrastructure

---

## OVERVIEW

This phase deploys the backend infrastructure (Genkit + Firebase Cloud Functions) that will power:
1. **Corporate Librarian** — AI agent for document analysis
2. **Drive Backup** — Secure logging to Google Drive
3. **Verification Engine** — Core agent orchestration

---

## PHASE 5, STEP 1: CLEAR THE DECK

Execute these commands to finalize the workspace:

```bash
cd /Users/puvansivanasan/PERPLEXITY/rpr-verify/

# Remove empty staging folder locally
rmdir .staging-for-operations 2>/dev/null || echo "Staging already cleared"

# Verify final state
echo "=== FINAL PROJECT STATE ==="
ls -la | grep -E "README|PRD|GUIDELINES|GUIDE|BRIEF|BIBLE|src|functions|firebase"

# Confirm git is clean
git status
```

**Expected:** Clean working tree, canonical files only.

---

## PHASE 5, STEP 2: CREATE FUNCTIONS DIRECTORY & INSTALL DEPENDENCIES

```bash
cd /Users/puvansivanasan/PERPLEXITY/rpr-verify/

# Create directory structure
mkdir -p functions/src/genkit
mkdir -p functions/src/prompts

# Initialize Node environment
cd functions
npm init -y

# Install required dependencies
npm install firebase-admin firebase-functions @genkit-ai/ai @genkit-ai/core @genkit-ai/firebase @genkit-ai/googleai googleapis zod
npm install --save-dev typescript firebase-functions-test

# Verify installation
npm list --depth=0
```

**Expected:** All packages installed, no errors.

---

## PHASE 5, STEP 3: CONFIGURE FUNCTIONS/PACKAGE.JSON

**Action:** Overwrite the auto-generated `functions/package.json` with this canonical version:

```json
{
  "name": "rpr-verify-functions",
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log",
    "genkit:start": "genkit start --npx"
  },
  "engines": {
    "node": "20"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^12.1.0",
    "firebase-functions": "^5.0.0",
    "@genkit-ai/ai": "^0.5.0",
    "@genkit-ai/core": "^0.5.0",
    "@genkit-ai/firebase": "^0.5.0",
    "@genkit-ai/googleai": "^0.5.0",
    "googleapis": "^140.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "firebase-functions-test": "^3.1.0"
  },
  "private": true
}
```

**Then:**

```bash
cd /Users/puvansivanasan/PERPLEXITY/rpr-verify/functions
npm install  # Re-resolve dependencies with canonical config
```

---

## PHASE 5, STEP 4: CREATE GOOGLE DRIVE BACKUP SCRIPT

**File:** `functions/src/google-drive-backup.ts`

```typescript
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// CONFIGURATION: RPR-VERIFY-LOGS (Secure Air Gap)
const TARGET_FOLDER_ID = '1EK4vh0xN-jiqeg07IBTntEv9NNGbMoFu'; 
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
```

---

## PHASE 5, STEP 5: CREATE SMOKE TEST FILE

**File:** `functions/src/test-drive.ts`

```typescript
import { backupToDrive } from './google-drive-backup';

async function test() {
  console.log("🚀 Starting Drive Connection Test...");
  try {
    const testData = {
      status: "ACTIVE",
      message: "RPR-VERIFY Agent Deployment: Smoke Test",
      timestamp: new Date().toISOString()
    };
    await backupToDrive('agent-deployment-log.json', testData);
    console.log("✅ TEST PASSED: Check your Google Drive folder!");
  } catch (e) {
    console.error("❌ TEST FAILED:", e);
  }
}

test();
```

---

## PHASE 5, STEP 6: RUN SMOKE TEST

**Prerequisites:**
1. ✅ `functions/service-account-key.json` exists (in .gitignore)
2. ✅ Service account has Drive API access
3. ✅ Folder ID `1EK4vh0xN-jiqeg07IBTntEv9NNGbMoFu` is accessible

**Execute test:**

```bash
cd /Users/puvansivanasan/PERPLEXITY/rpr-verify/functions

# Run the smoke test
npx ts-node src/test-drive.ts
```

**Expected output:**
```
🚀 Starting Drive Connection Test...
✅ TEST PASSED: Check your Google Drive folder!
```

**Success criteria:**
- ✅ Green message appears in terminal
- ✅ `agent-deployment-log.json` appears in Google Drive folder (RPR-VERIFY-LOGS)

---

## NEXT STEPS

After smoke test passes:
1. Commit functions directory to git
2. Deploy functions to Firebase
3. Initialize Genkit agents
4. Configure agent deployment tasks

**Ready to proceed once smoke test passes.** 🚀
