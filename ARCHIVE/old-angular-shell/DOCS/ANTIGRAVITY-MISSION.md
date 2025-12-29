# 🤖 ANTIGRAVITY MISSION BRIEF: Build Verification & Runtime Testing

**Target Project:** rpr-verify-b (Angular + Flask Backend)  
**Local Paths:** /Users/puvansivanasan/PERPLEXITY/rpr-verify-v1  
**Mission Duration:** 45–60 minutes  
**Expected Output:** Build success report + browser verification screenshots

---

## PHASE 1: File Verification (10 min)

### Task 1.1 — Verify File Placement
```bash
# Check that all component files exist in correct locations
ls -la src/app/core/layout/main-layout.component.ts
ls -la src/app/core/layout/main-layout.component.html
ls -la src/app/core/layout/main-layout.component.scss
ls -la src/styles/variables.scss

# Expected Output:
# ✅ All 4 files present (not .backup files)
# Report any MISSING files immediately
```

### Task 1.2 — Verify File Contents
```bash
# Check that files contain CORRECTED content (not original/broken versions)

# ✅ main-layout.component.ts should contain:
grep -n "isResolutionActive = computed" src/app/core/layout/main-layout.component.ts
# Expected: line with ".includes('/resolution')" NOT ".includes('/disputes')"

# ✅ main-layout.component.html should contain:
grep -n "routerLink=\"/resolution\"" src/app/core/layout/main-layout.component.html
# Expected: At least one matching line for RESOLUTION tab

# ✅ main-layout.component.scss should contain:
grep -n "accent-3d-mode: #FF0000" src/app/core/layout/main-layout.component.scss
# Expected: Red color variable defined

# ✅ variables.scss should contain:
grep -n "accent-brand:" src/styles/variables.scss
# Expected: Design tokens defined

# Report any MISSING or INCORRECT patterns
```

### Task 1.3 — Verify Routing Module
```bash
# Check that app routing includes required routes
find src/app -name "*.routes.ts" -o -name "app.routes.ts" -o -name "routing.module.ts"

# If found, verify it contains these routes:
grep -n "path: 'upload'" src/app/app.routes.ts
grep -n "path: 'transactions'" src/app/app.routes.ts
grep -n "path: 'verification'" src/app/app.routes.ts
grep -n "path: 'resolution'" src/app/app.routes.ts

# Expected: All 4 routes present
# If any route is MISSING, report and note which one
```

---

## PHASE 2: Dependencies & Build Setup (15 min)

### Task 2.1 — Clean Install
```bash
cd /Users/puvansivanasan/PERPLEXITY/rpr-verify-v1

# Remove stale node_modules and package-lock
rm -rf node_modules package-lock.json

# Clean npm cache
npm cache clean --force

# Fresh install (use npm ci for exact versions)
npm ci

# Expected: No errors, all dependencies installed
# Report output: "added X packages" or any warnings
```

### Task 2.2 — Check TypeScript Version
```bash
npx tsc --version

# Expected: TypeScript 5.x or higher
# Report: Actual version number
```

### Task 2.3 — Check Angular Version
```bash
ng version

# Expected: Angular v17 or v18
# Report: Actual version from output
```

---

## PHASE 3: Build Verification (15 min)

### Task 3.1 — Production Build
```bash
# Run the production build (strict mode, optimization enabled)
ng build --configuration production

# Expected: Build succeeds with output like:
# ✅ Compiling successfully
# ✅ Bundle size reported
# ✅ No TypeScript errors or warnings (regarding new layout files)

# If build FAILS:
#   - Capture FULL error message (don't truncate)
#   - Report exact line numbers
#   - Note if error is related to: routing, SCSS imports, template syntax, or types
```

### Task 3.2 — Check Build Output
```bash
# Verify dist/ folder was created
ls -lah dist/

# Expected: dist/rpr-verify-v1 folder with:
#   - index.html
#   - main.*.js (main bundle)
#   - styles.*.css (compiled CSS)
#   - Other chunks

# Report: Build artifact sizes
```

---

## PHASE 4: Test Suite Verification (10 min)

### Task 4.1 — Run Unit Tests
```bash
npm run test

# This runs Vitest in CI mode (single run, no watch)

# Expected outcomes:
# ✅ All existing tests pass (28+ tests)
# ⚠️ If MainLayoutComponent tests exist, they should pass
# ❌ If tests fail, capture:
#     - Failed test name
#     - Error message
#     - Suggestion to fix (if obvious)
```

### Task 4.2 — Report Test Results
If tests fail:
```bash
# Capture full test output for debugging
npm run test 2>&1 | tee test-output.log

# Report:
# - Total tests run
# - Passed / Failed count
# - Any failures related to layout or routing
```

---

## PHASE 5: Local Dev Server & Browser Verification (15–20 min)

### Task 5.1 — Start Dev Server
```bash
# Start Angular development server
ng serve --open

# Expected: Server starts on localhost:4200
# Watch for terminal output:
# ✅ "Angular Live Development Server is listening"
# ✅ "Application bundle generated successfully"

# Note: DO NOT CLOSE this terminal. Keep it running.
```

### Task 5.2 — Open Browser & Verify UI
```bash
# Once ng serve is running, open browser to:
# http://localhost:4200

# Verification Checklist (in embedded browser):
✅ Page loads without black screen
✅ Header visible (RPR-VERIFY logo + nav tabs)
✅ Company bar shows "RPR COMMUNICATIONS LLC | FINANCIAL FORENSICS..."
✅ Four tabs visible and clickable:
   - INFORMATION
   - TRANSACTIONS
   - VERIFICATION
   - RESOLUTION
✅ Tabs have white text, uppercase, proper spacing
✅ Active tab shows underline
✅ Clicking INFORMATION tab → underline appears, content area shows
✅ Clicking RESOLUTION tab → text turns RED, underline RED
✅ No console errors (open F12 → Console)
```

### Task 5.3 — Tab Navigation Test
```
# In browser console, run:
# - Click INFORMATION tab → should show content for upload form
# - Click TRANSACTIONS tab → should show transaction ledger
# - Click VERIFICATION tab → should show customer lookup
# - Click RESOLUTION tab → should show case management UI (red theme)
# - Verify each tab renders different content
# - Verify router-outlet is swapping content correctly

# Expected: Smooth navigation, no page flicker, no console errors
```

### Task 5.4 — Header Styling Validation
```
# In browser (F12 Inspector), check:
✅ Header background is black (#000000)
✅ Text is white (#FFFFFF)
✅ RESOLUTION tab text is red (#FF0000) when active
✅ Logo spacing: "RPR" in teal, "-VERIFY" in white
✅ Nav tabs have 40px gap between them
✅ Header height is ~90px
✅ Company bar background is dark (#050815)
```

---

## PHASE 6: Backend Integration Check (Optional, 5 min)

### Task 6.1 — Check Backend Status
```bash
# In a NEW terminal, check if Flask backend is running:
curl -X POST http://localhost:8080/api/v1/health 2>/dev/null || echo "Backend not running"

# Expected: Either response 200 OK, or "Backend not running"
# If backend IS running:
#   - Verify CORS headers: curl -I http://localhost:8080
#   - Check for "Access-Control-Allow-Origin: http://localhost:4200"
```

### Task 6.2 — Test Frontend → Backend Communication
```bash
# In browser console (F12 → Console), test a mock API call:
fetch('http://localhost:8080/api/v1/test', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer test-token' }
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e))

# Expected: Either success response or CORS error (which means backend is responding)
# Note CORS errors vs connection refused — they indicate different issues
```

---

## FINAL REPORT (to be submitted)

Submit results as JSON:

```json
{
  "timestamp": "2025-12-23 21:00 UTC+8",
  "mission_status": "COMPLETE|BLOCKED",
  "phases": {
    "phase_1_files": {
      "status": "✅|❌",
      "files_present": ["main-layout.component.ts", "main-layout.component.html", "main-layout.component.scss", "variables.scss"],
      "files_missing": [],
      "content_verified": "✅|❌"
    },
    "phase_2_dependencies": {
      "status": "✅|❌",
      "npm_ci_result": "success|failed with error: ...",
      "typescript_version": "5.2.2",
      "angular_version": "17.0.0",
      "notes": ""
    },
    "phase_3_build": {
      "status": "✅|❌",
      "build_command": "ng build --configuration production",
      "result": "success|failed",
      "error_details": "",
      "dist_folder_exists": true,
      "bundle_size_bytes": 0
    },
    "phase_4_tests": {
      "status": "✅|❌",
      "total_tests": 0,
      "passed": 0,
      "failed": 0,
      "failed_tests": []
    },
    "phase_5_browser": {
      "status": "✅|❌",
      "dev_server_running": true,
      "url_reachable": "http://localhost:4200",
      "header_visible": true,
      "tabs_visible": 4,
      "resolution_tab_red": true,
      "console_errors": [],
      "screenshots_captured": ["header.png", "tabs.png", "resolution-active.png"]
    },
    "phase_6_backend": {
      "status": "✅|❌|SKIPPED",
      "backend_running": false,
      "cors_configured": "unknown"
    }
  },
  "summary": "All phases complete. Frontend builds and runs successfully.",
  "blockers": [],
  "next_steps": "Wire Flask backend to frontend API calls"
}
```

---

## MISSION COMPLETE CRITERIA

**✅ Mission succeeds if:**
1. All 4 layout files in correct locations ✅
2. `ng build --configuration production` succeeds ✅
3. `npm run test` passes all tests ✅
4. `ng serve` starts on localhost:4200 ✅
5. Browser shows: header, tabs, routing works ✅
6. RESOLUTION tab displays in red when active ✅
7. No console errors in browser ✅

**❌ Mission blocked if:**
- Build fails with TypeScript error
- Test suite fails (non-layout related)
- Dev server crashes
- Header or tabs don't render
- Routing broken (tabs don't navigate)

---

**Status:** Ready to execute  
**Estimated Time:** 45–60 minutes  
**Assigned to:** Antigravity (AG)  
**Report to:** Perplexity Command when complete
