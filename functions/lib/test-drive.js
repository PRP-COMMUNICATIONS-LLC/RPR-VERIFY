"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_drive_backup_1 = require("./google-drive-backup");
async function test() {
    console.log("🚀 Starting Drive Connection Test...");
    try {
        const testData = {
            status: "ACTIVE",
            message: "RPR-VERIFY Agent Deployment: Smoke Test",
            timestamp: new Date().toISOString()
        };
        await (0, google_drive_backup_1.backupToDrive)('agent-deployment-log.json', testData);
        console.log("✅ TEST PASSED: Check your Google Drive folder!");
    }
    catch (e) {
        console.error("❌ TEST FAILED:", e);
    }
}
test();
//# sourceMappingURL=test-drive.js.map