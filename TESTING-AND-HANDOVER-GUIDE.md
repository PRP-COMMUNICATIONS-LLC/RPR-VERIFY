# RPR-VERIFY: Testing Guide & Thread Handover Documentation

**Date:** December 15, 2025, 10:20 AM +08  
**Status:** Production Readiness Phase  
**Owner:** Founder  
**Next Phase:** UI Alignment → Domain Setup → Landing Page → Thread Handover

---

## PART 1: TESTING THE APP

### Test Environment
- **Live URL:** https://rpr-verify-b.web.app
- **Backend API:** https://rpr-verify-794095666194.asia-southeast1.run.app
- **Region:** asia-southeast1 (Singapore)
- **Status:** ✅ Live and operational

### Test Credentials

**Test Account 1 (Authorized):**
- Email: `butterdime@gmail.com`
- Status: Whitelisted, can authenticate
- Scope: Full access to dashboard + all features

**Test Account 2 (Company Domain):**
- Email: Any `@rprcomms.com` address
- Status: Automatically authorized (domain whitelist)
- Scope: Full access

**Unauthorized Test:**
- Email: Any other Gmail/email
- Expected: Sign-in popup appears, but access is denied after auth
- Error Message: "Access denied. Only @rprcomms.com accounts or whitelisted emails are allowed."

---

## STEP 1: TEST LOGIN FLOW

### What to Test:

**1.1 Navigate to Login Page**
```
1. Go to https://rpr-verify-b.web.app
2. You should see login page with Google Sign-in button
3. Button should show official Google branding (web_dark_sq_SI@4x.png)
```

**Expected Result:** Login page loads, button displays correctly

---

**1.2 Click Google Sign-In Button**
```
1. Click the Google Sign-in button
2. Google OAuth popup should appear
3. You should be prompted to select a Google account or sign in
```

**Expected Result:** Google popup opens (not blocked)

---

**1.3 Sign In with Authorized Account**
```
1. Select butterdime@gmail.com (or any @rprcomms.com account)
2. Grant permissions for Google Drive access
3. You should be redirected to the dashboard
```

**Expected Result:**
- Dashboard loads
- URL changes to `https://rpr-verify-b.web.app/dashboard`
- Session active (no redirect to login)
- User email displayed (if shown in UI)

---

**1.4 Test Session Persistence**
```
1. From dashboard, refresh the page (F5)
2. You should remain logged in
3. No redirect to login page
```

**Expected Result:** Session persists, no re-authentication needed

---

### Test Login Failure Scenario

**1.5 Try to Sign In with Unauthorized Account**
```
1. Sign out (if logged in)
2. Click Google Sign-In again
3. Select a DIFFERENT Gmail account (not butterdime@gmail.com, not @rprcomms.com)
4. Grant permissions
5. System should reject access
```

**Expected Result:**
- Error message appears: "Access denied. Only @rprcomms.com accounts or whitelisted emails are allowed."
- User is signed out
- Redirected back to login page
- No access to dashboard

---

## STEP 2: TEST FRONTEND ↔ BACKEND COMMUNICATION

### 2.1 Check Network Requests (Browser DevTools)

```
1. Open browser DevTools (F12)
2. Go to Network tab
3. Log in to the app
4. Look for API requests to the backend
5. You should see requests like:
   - https://rpr-verify-794095666194.asia-southeast1.run.app/api/...
```

**Expected Result:**
- API requests succeed (HTTP 200)
- No CORS errors in Console tab
- Requests contain proper headers (Authorization, Content-Type, etc.)

---

### 2.2 Test Report Generation (if UI has this feature)

```
1. From dashboard, navigate to case/report section
2. Select a test case or upload a document
3. Click "Generate Report" or similar button
4. Monitor Network tab for API requests
5. Report should load or data should display
```

**Expected Result:**
- API call to `/api/reports/cis/[caseId]` succeeds
- Report data loads on frontend
- No errors in console

---

### 2.3 Test PDF Download

```
1. From report viewer (if available), click "Download PDF"
2. Monitor Network tab
3. A file download should start
```

**Expected Result:**
- API call to `/api/reports/cis/[caseId]?format=pdf` succeeds (HTTP 200)
- Response type is `application/pdf`
- PDF file downloads successfully
- File opens in PDF viewer

---

## STEP 3: VERIFY CORS CONFIGURATION

### What CORS Allows:
- ✅ `https://rpr-verify-b.web.app` (production)
- ✅ `https://verify.rprcomms.com` (custom domain - when configured)
- ✅ `https://www.rprcomms.com` (company site)
- ✅ `http://localhost:4200` (local development)

### Test CORS:

```
1. Open browser DevTools Console (F12 → Console)
2. No CORS errors should appear
3. If you see "Access-Control-Allow-Origin" errors:
   - Check that your origin is in the whitelist above
   - Check functions/src/index.ts CORS configuration
```

---

## TESTING CHECKLIST

- [ ] Login page loads without errors
- [ ] Google Sign-In button visible and styled correctly
- [ ] Authorized user (butterdime@gmail.com) can sign in
- [ ] Authorized user (any @rprcomms.com) can sign in
- [ ] Unauthorized user gets rejection error
- [ ] Dashboard loads after successful login
- [ ] Session persists on page refresh
- [ ] Network requests to backend succeed (HTTP 200)
- [ ] No CORS errors in console
- [ ] API responses are received and processed
- [ ] PDF download works (if applicable)
- [ ] All UI elements load correctly

---

# PART 2: CREDENTIALS & SERVICE ACCOUNTS

## Firebase Project

**Project ID:** `rpr-verify-b`  
**Project Number:** `794095666194`

### Firebase Authentication
- **Auth Domain:** rpr-verify-b.firebaseapp.com
- **Providers:** Google OAuth
- **Custom Claims:** (None currently - can add roles in Phase 3)

### Firebase Hosting
- **URL:** https://rpr-verify-b.web.app
- **Custom Domain:** (To be configured in Part 3)
- **Build Output:** `dist/rpr-client-portal/browser/`

### Cloud Functions
- **Function Name:** `cisReportApi`
- **Region:** asia-southeast1 (Singapore)
- **Runtime:** Node.js 20
- **Entry Point:** https://rpr-verify-794095666194.asia-southeast1.run.app

---

## Google OAuth Credentials

**OAuth 2.0 Client ID (Web)**
```
Client ID: 794095666194-fimj7pc39nmugc4rqt7bd3k490mrsu3q.apps.googleusercontent.com
Client Secret: (stored in environment, not shared)
```

**Authorized JavaScript Origins:**
- https://rpr-verify-b.web.app
- https://localhost:4200
- https://verify.rprcomms.com (to be added)

**Authorized Redirect URIs:**
- https://rpr-verify-b.web.app/login
- https://localhost:4200/login
- https://verify.rprcomms.com/login (to be added)

**Required Google Drive Scopes:**
- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/drive.appdata`

---

## Firebase Web API Key

**API Key:** `AIzaSyDSv50wy6g0TlhJoEa2gldfDgKNxSDkyEk`

**Restrictions:**
- HTTP Referrer: `https://rpr-verify-b.web.app/*`
- API Restrictions: Unrestricted (or limit to needed APIs)

---

## GitHub Secrets (for CI/CD)

**Required Secrets in GitHub Repository Settings:**

```
FIREBASE_TOKEN: [Firebase CLI token - stored securely]
FIREBASE_PROJECT_ID: rpr-verify-b
GCP_PROJECT_ID: rpr-verify-b
```

**How to Add:**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add new repository secret
3. Name: `FIREBASE_TOKEN`
4. Value: (Get from `firebase login:ci`)

---

## Service Account (Backend/Admin Tasks)

**If Backend Needs Admin Access:**

```json
{
  "type": "service_account",
  "project_id": "rpr-verify-b",
  "private_key_id": "[key-id]",
  "private_key": "[private-key]",
  "client_email": "firebase-adminsdk-[uid]@rpr-verify-b.iam.gserviceaccount.com",
  "client_id": "[client-id]",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "[cert-url]"
}
```

**How to Create:**
1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create new service account
3. Grant roles: Firebase Admin, Firestore Admin
4. Create and download JSON key
5. Store securely (not in GitHub)

---

# PART 3: DOMAIN SETUP & CUSTOM DOMAIN

## Current URLs
- **Hosting:** https://rpr-verify-b.web.app (Firebase default)
- **API:** https://rpr-verify-794095666194.asia-southeast1.run.app (Cloud Functions)

## Target URLs (To Configure)
- **Hosting:** https://verify.rprcomms.com (custom domain)
- **API:** (can be same or separate subdomain)

## Steps to Connect Custom Domain

### 3.1 Add Domain to Firebase Hosting
```
1. Firebase Console → Hosting → Custom domain
2. Click "Connect domain"
3. Enter: verify.rprcomms.com
4. Firebase will provide DNS records to add
```

### 3.2 Update DNS Records (in Domain Registrar)
```
1. Go to domain registrar (where you own rprcomms.com)
2. DNS Management / DNS Settings
3. Add A record or CNAME record (Firebase will specify)
4. Example:
   - Type: A
   - Host: verify
   - Value: [Firebase IP]
   OR
   - Type: CNAME
   - Host: verify
   - Value: ghs.googlehosted.com
```

### 3.3 Wait for DNS Propagation
```
DNS changes can take 24-48 hours to propagate.
You can check status at:
- Firebase Hosting console (shows provisioning status)
- dns.google.com (DNS propagation checker)
```

### 3.4 Update OAuth Credentials
```
After domain is live:
1. Google Cloud Console → OAuth 2.0 Credentials
2. Add to Authorized JavaScript Origins:
   - https://verify.rprcomms.com
3. Add to Authorized Redirect URIs:
   - https://verify.rprcomms.com/login
```

### 3.5 Update Environment Variables (if needed)
```
In src/environments/environment.ts:
- Update apiUrl if needed
- Update firebase config (usually same project)
```

---

# PART 4: PRODUCT LANDING PAGE

## Current Status
- Hosting: Firebase Hosting
- URL: https://rpr-verify-b.web.app (redirects to login)

## Landing Page Options

### Option A: Add Landing Page to Same App
```
1. Create landing component (src/app/landing/)
2. Add route: / → landing component
3. Update routing: / shows landing, /dashboard shows app
4. Same deployment, one app
```

### Option B: Separate Landing Site
```
1. Create separate Angular/Next.js/static site
2. Deploy to: https://rprcomms.com/ or https://www.rprcomms.com/
3. Link to app: https://verify.rprcomms.com
4. Separate deployments
```

### Option C: Redirect with Landing
```
1. Landing page deployed at: https://rprcomms.com/
2. App at: https://verify.rprcomms.com
3. Landing page links to app
3. Users choose to enter app from landing
```

---

## Recommended Landing Page Content

```
- Hero section (What is RPR-VERIFY?)
- Key features
  - Document upload & verification
  - CIS compliance reports
  - Google Drive integration
  - Secure authentication
- How it works (3-4 steps)
- Pricing/Plans (if applicable)
- Call to action ("Start Verifying" button → login)
- FAQ
- Contact information
- Footer with links
```

---

# PART 5: THREAD HANDOVER DOCUMENTATION

## Handover Checklist

- [ ] Testing completed (all checkboxes above checked)
- [ ] Production URL verified: https://rpr-verify-b.web.app
- [ ] Login flow working
- [ ] Backend API responding
- [ ] PDF download functional
- [ ] CORS properly configured
- [ ] Credentials documented (see Part 2)
- [ ] Custom domain configured (Part 3)
- [ ] Landing page created/planned (Part 4)
- [ ] GitHub Actions CI/CD working
- [ ] All secrets in GitHub
- [ ] Service account (if needed) created

## Handover Document Template

**To:** Next Thread Agent  
**From:** Current Agent  
**Date:** [Date]  
**Project:** RPR-VERIFY-V1  

### Project Status Summary
```
✅ Phase 1 (Proactive Compliance): COMPLETE
✅ Phase 2A (Deployment Pipeline): COMPLETE
✅ Phase 2 (Workspace Unification): COMPLETE
🔄 Phase 3 (Production Readiness): IN PROGRESS
   - Testing: [Status]
   - UI Alignment: [Status]
   - Domain Setup: [Status]
   - Landing Page: [Status]
```

### Key Resources
1. **GitHub Repository:** https://github.com/Butterdime/rpr-verify
2. **Production URL:** https://rpr-verify-b.web.app
3. **Firebase Console:** https://console.firebase.google.com/project/rpr-verify-b
4. **Backend API:** https://rpr-verify-794095666194.asia-southeast1.run.app
5. **Google Cloud Console:** https://console.cloud.google.com/

### Credentials Package
- Firebase Project ID: rpr-verify-b
- Google OAuth Client ID: [stored securely]
- Test Account: butterdime@gmail.com
- Service Account: [if created]

### Next Steps
1. [Task 1]
2. [Task 2]
3. [Task 3]

### Blockers/Notes
- [Any blockers]
- [Technical notes]
- [Decisions made]

---

## Knowledge Base for Next Agent

**Technology Stack:**
- Frontend: Angular 21.0.0, TypeScript 5.9.2
- Backend: Node.js 20, Express.js, Firebase Cloud Functions
- Database: Firestore
- Hosting: Firebase Hosting
- Auth: Google OAuth 2.0
- CI/CD: GitHub Actions

**Architecture:**
- Single unified workspace: `verify`
- Frontend: `src/` → Angular app
- Backend: `functions/src/` → Cloud Functions
- Build output: `dist/rpr-client-portal/browser/` (hosting) + `functions/lib/` (functions)

**Key Services:**
- `AuthService` - Google OAuth login
- `ReportService` - Backend API communication
- `FirestoreCasesService` - Firestore CRUD
- `GoogleDriveService` - Google Drive integration

**Common Tasks:**
1. Deploy to production: `git push main` (GitHub Actions auto-deploys)
2. Test locally: `ng serve` (frontend) + Firebase Studio (backend)
3. Check logs: Firebase Console → Cloud Functions → Logs
4. Troubleshoot CORS: Check `functions/src/index.ts` corsOptions

---

**End of Testing & Handover Guide**

*Last Updated: December 15, 2025*
