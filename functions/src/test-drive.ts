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
