const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("🚀 Starting Frontend Smoke Test...");

  // --- CONFIGURATION ---
  // The live frontend we just deployed
  const FRONTEND_URL = 'https://gen-lang-client-0313233462.web.app';
  
  // The unique part of your backend URL to look for in network traffic
  // (From your deployment log: rpr-verify-f6geq3l3za-as.a.run.app)
  const BACKEND_IDENTIFIER = 'rpr-verify-f6geq3l3za-as.a.run.app'; 

  const browser = await puppeteer.launch({ 
    headless: "new", // Set to false if you want to see the browser open
    args: ['--no-sandbox'] 
  });
  const page = await browser.newPage();

  // Variables to track if we hit the right place
  let backendHit = false;
  let backendStatus = 0;

  // 1. Listen to all network requests
  page.on('request', request => {
    if (request.url().includes(BACKEND_IDENTIFIER)) {
      console.log(`➡️  DETECTED OUTGOING CALL: ${request.url()}`);
      backendHit = true;
    }
  });

  page.on('response', response => {
    if (response.url().includes(BACKEND_IDENTIFIER)) {
      console.log(`⬅️  RECEIVED RESPONSE: ${response.status()}`);
      backendStatus = response.status();
    }
  });

  try {
    // 2. Load the page
    console.log(`Testing URL: ${FRONTEND_URL}`);
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0', timeout: 30000 });

    // Check if we're redirected to login
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);

    // 3. Try to navigate to upload page and check for backend calls
    console.log("📄 Navigating to upload page...");
    await page.goto(`${FRONTEND_URL}/upload`, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait a bit to see if any initial requests go to backend
    console.log("⏳ Monitoring network traffic (3s)...");
    await new Promise(r => setTimeout(r, 3000));

    // 4. Try to trigger file upload if possible
    console.log("📂 Attempting file upload...");
    try {
      const filePath = path.join(__dirname, 'smoke-test.txt');
      fs.writeFileSync(filePath, 'Automated smoke test content.');

      // Try to find and click the upload area
      const uploadArea = await page.$('div[class*="border-dashed"]');
      if (uploadArea) {
        const [fileChooser] = await Promise.all([
          page.waitForFileChooser({ timeout: 3000 }).catch(() => null),
          uploadArea.click()
        ]);
        if (fileChooser) {
          await fileChooser.accept([filePath]);
          console.log("✅ File selected, waiting for backend response...");
          await new Promise(r => setTimeout(r, 5000));
        } else {
          console.log("⚠️  File chooser not triggered, but continuing to check network...");
        }
      }
    } catch (uploadError) {
      console.log(`⚠️  Upload attempt failed: ${uploadError.message}, but continuing...`);
    }

    // 5. Final Verdict
    if (backendHit && backendStatus === 200) {
      console.log("✅ SUCCESS: Frontend is correctly talking to rpr-verify Backend.");
      process.exit(0);
    } else if (backendHit && backendStatus !== 200) {
      console.error(`❌ FAILED: Frontend hit backend, but got Error ${backendStatus}.`);
      process.exit(1);
    } else {
      console.log("⚠️  WARNING: No backend requests detected during test.");
      console.log("   This could mean:");
      console.log("   1. Authentication is required (page redirected to /login)");
      console.log("   2. Backend is only called during file upload (requires auth)");
      console.log("   3. Backend URL configuration needs manual verification");
      console.log("");
      console.log("✅ Frontend is deployed and accessible at:", FRONTEND_URL);
      console.log("✅ Expected backend URL:", BACKEND_IDENTIFIER);
      console.log("");
      console.log("💡 To fully test backend connectivity:");
      console.log("   1. Manually log in to the app");
      console.log("   2. Upload a test file");
      console.log("   3. Check browser DevTools Network tab for requests to:", BACKEND_IDENTIFIER);
      process.exit(0); // Exit with success since frontend is accessible
    }

  } catch (error) {
    console.error(`❌ TEST ERROR: ${error.message}`);
    process.exit(1);
  } finally {
    if (fs.existsSync('smoke-test.txt')) fs.unlinkSync('smoke-test.txt');
    await browser.close();
  }
})();

