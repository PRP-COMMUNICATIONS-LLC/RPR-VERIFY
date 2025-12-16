# 🔒 Production Deployment Security Checklist

**Project:** RPR-VERIFY  
**Phase:** Production Hardening - Auth Guards Re-enabled  
**Date:** December 16, 2025, 11:22 PM +08  
**Branch:** `feature/escalation-dashboard-ui`

---

## 🚨 Critical Security Update

**Issue Identified:** All authentication guards were **disabled for testing** and remained commented out.

**Risk Level:** 🔴 **CRITICAL** - Production website completely unprotected

**Resolution:** Auth guards **re-enabled** in [commit 53f93e3](https://github.com/Butterdime/rpr-verify/commit/53f93e3017639013848511b9803a37a554193989)

---

## ✅ Pre-Deployment Verification

### 1. Authentication Configuration

#### ✅ Auth Guard Implementation
**File:** `src/app/core/guards/auth.guard.ts`

```typescript
✓ Uses @angular/fire/auth authState
✓ Proper RxJS operators (map, take)
✓ Redirects unauthenticated users to /login
✓ Respects environment.disableAuth for dev bypass
```

**Status:** ✅ Production-ready (already implemented correctly)

---

#### ✅ Protected Routes
**File:** `src/app/app.routes.ts`

**Before (INSECURE):**
```typescript
{
  path: 'dashboard/escalation',
  loadComponent: () => import('...'),
  // canActivate: [authGuard]  // ❌ DISABLED
}
```

**After (SECURE):**
```typescript
{
  path: 'dashboard/escalation',
  loadComponent: () => import('...'),
  canActivate: [authGuard]  // ✅ ENABLED
}
```

**Protected Routes (11 total):**
- ✅ `/dashboard` - Main dashboard
- ✅ `/dashboard/escalation` - **Escalation Dashboard (sensitive case data)**
- ✅ `/case-detail` - Case detail view
- ✅ `/upload` - Document upload
- ✅ `/cases/new` - New case creation
- ✅ `/disputes` - Dispute management
- ✅ `/disputes/:id` - Specific dispute
- ✅ `/reports` - Reports dashboard
- ✅ `/cases` - Case list
- ✅ `/cases/:id` - Specific case detail
- ✅ `/cases/:id/cis-report` - **CIS Report Viewer (identity documents)**

**Public Routes (1 total):**
- ✅ `/login` - Authentication page (no guard)

**Fallback Routes:**
- ✅ Root `/` redirects to `/login`
- ✅ Wildcard `**` redirects to `/login` (404 handling)

---

### 2. Environment Configuration

#### Production Environment
**File:** `src/environments/environment.prod.ts`

```typescript
✅ production: true
✅ OAuth Client ID: 794095666194-j1jl81fks7pl6a5v2mv557cs16hpsmkg
✅ API URL: https://rpr-verify-794095666194.asia-southeast1.run.app
✅ Firebase Project: rpr-verify-b
✅ Firebase Auth Domain: rpr-verify-b.firebaseapp.com
❌ disableAuth flag: NOT PRESENT (correct - auth enabled by default)
```

**Status:** ✅ Production-ready

---

#### Development Environment
**File:** `src/environments/environment.ts`

```typescript
✅ production: false
✅ disableAuth: true (allows local development bypass)
```

**Status:** ✅ Correctly configured for local development

---

### 3. Application Configuration

#### App Config Providers
**File:** `src/app/app.config.ts`

```typescript
✅ provideRouter(routes, withPreloading(PreloadAllModules))
✅ provideHttpClient()
✅ provideFirebaseApp(() => initializeApp(environment.firebase))
✅ provideAuth(() => getAuth())
✅ provideFirestore(() => getFirestore())
```

**Status:** ✅ All necessary providers configured

---

### 4. OAuth Configuration

#### Active OAuth Client
**Client ID:** `794095666194-j1jl81fks7pl6a5v2mv557cs16hpsmkg.apps.googleusercontent.com`

**Authorized JavaScript Origins:**
```
✅ https://rpr-verify-b.web.app
✅ https://rpr-verify-b.firebaseapp.com
✅ http://localhost:4200 (for local development)
```

**Authorized Redirect URIs:**
```
✅ https://rpr-verify-b.web.app/__/auth/handler
✅ https://rpr-verify-b.firebaseapp.com/__/auth/handler
✅ http://localhost:4200/__/auth/handler
```

**Status:** ✅ Properly configured (per Phase 2 handover)

---

### 5. Backend Configuration

#### Cloud Run Service
**Service Name:** `rpr-verify`  
**Project:** `rpr-verify-b`  
**Region:** `asia-southeast1`  
**URL:** `https://rpr-verify-794095666194.asia-southeast1.run.app`

**Configuration:**
```
✅ Memory: 2GB
✅ Timeout: 60s
✅ Min Instances: 1 (warm instance)
✅ CORS Origins: https://rpr-verify-b.web.app, http://localhost:4200
✅ Auth: Firebase ID token validation (EXPECTED_AUD)
```

**Health Status:**
```bash
curl https://rpr-verify-794095666194.asia-southeast1.run.app/health
# Expected: {"status":"healthy","firebase_admin":"initialized"}
```

**Status:** ✅ Operational (per Phase 2 handover)

---

## 🚀 Deployment Steps

### Step 1: Build Production Bundle

```bash
# Ensure on correct branch
git checkout feature/escalation-dashboard-ui
git pull origin feature/escalation-dashboard-ui

# Install dependencies
npm install

# Build for production (uses environment.prod.ts)
npm run build
```

**Expected Output:**
```
✓ Building Angular application
✓ Copying assets
✓ Generating browser application bundles
✓ Optimizing bundles
✓ Generating service worker

Output: dist/rpr-verify/
```

---

### Step 2: Deploy to Firebase Hosting

```bash
# Deploy frontend
firebase deploy --only hosting --project rpr-verify-b
```

**Expected Output:**
```
✓ hosting[rpr-verify-b]: file upload complete
✓ Deploy complete!

Hosting URL: https://rpr-verify-b.web.app
```

---

### Step 3: Verify Auth Flow

#### Test 1: Unauthenticated Access (Should Redirect)
```bash
# Open incognito browser
# Navigate to: https://rpr-verify-b.web.app/dashboard

# Expected Behavior:
✓ Immediately redirects to /login
✓ Does NOT show dashboard content
✓ No errors in console
```

#### Test 2: Login Flow
```bash
# Navigate to: https://rpr-verify-b.web.app/login
# Click "Sign in with Google"

# Expected Behavior:
✓ Google account picker appears
✓ After selection, redirects to /dashboard
✓ Dashboard content loads
✓ Navigation works without re-authentication
```

#### Test 3: Direct Protected Route Access
```bash
# Navigate to: https://rpr-verify-b.web.app/dashboard/escalation

# If NOT logged in:
✓ Redirects to /login

# If logged in:
✓ Shows Escalation Dashboard
✓ Loads case data from backend
```

#### Test 4: CIS Report Access (Most Sensitive)
```bash
# Navigate to: https://rpr-verify-b.web.app/cases/[case-id]/cis-report

# If NOT logged in:
✓ Redirects to /login

# If logged in:
✓ Loads identity verification documents
✓ Backend validates Firebase token
```

---

### Step 4: Backend API Authentication Test

```bash
# Test authenticated endpoint
curl -H "Authorization: Bearer [FIREBASE_ID_TOKEN]" \
     https://rpr-verify-794095666194.asia-southeast1.run.app/escalations

# Expected: 200 OK with case data

# Test without token
curl https://rpr-verify-794095666194.asia-southeast1.run.app/escalations

# Expected: 401 Unauthorized
```

---

## 🚨 Known Issues & Resolutions

### Issue 1: Google Drive API Scope Error
**Status:** ⚠️ Pending (from Phase 2 handover)

**Error:**
```
access_not_configured: Drive API not enabled
```

**Impact:** Blocks sign-in flow if Drive scopes remain in auth provider

**Resolution Options:**
1. Enable Drive API: `gcloud services enable drive.googleapis.com --project=rpr-verify-b`
2. Remove Drive scopes from `src/app/services/auth.service.ts`

**Recommendation:** Remove Drive scopes unless Drive integration is required for production.

---

### Issue 2: Development Auth Bypass
**Status:** ✅ Controlled by environment flag

**Local Development:**
```typescript
// src/environments/environment.ts
disableAuth: true  // Allows UI development without login
```

**Production:**
```typescript
// src/environments/environment.prod.ts
// disableAuth not present - auth enforced by default
```

**Verification:** Auth guard checks `(environment as any).disableAuth` before bypassing.

---

## 📊 Security Metrics

### Before This Update:
- 🔴 Protected Routes: **0 / 11** (0%)
- 🔴 Sensitive Data Exposure: **YES**
- 🔴 Auth Enforcement: **DISABLED**

### After This Update:
- 🟢 Protected Routes: **11 / 11** (100%)
- 🟢 Sensitive Data Exposure: **NO**
- 🟢 Auth Enforcement: **ENABLED**

---

## ✅ Final Checklist

- [x] Auth guards re-enabled in `app.routes.ts`
- [x] Wildcard route added for 404 handling
- [x] Production environment verified
- [x] OAuth client configuration confirmed
- [ ] **Frontend deployed to Firebase Hosting** ⬅️ **PENDING**
- [ ] **Auth flow tested end-to-end** ⬅️ **PENDING**
- [ ] **Backend API auth validated** ⬅️ **PENDING**
- [ ] **Drive API scope issue resolved** ⬅️ **PENDING**

---

## 🔗 Related Documentation

- [Phase 2 Handover](./PHASE2_HANDOVER.md) - OAuth resolution & deployment status
- [COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md](./COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md) - Test suite setup
- [COPILOT_LOCAL_TESTING_GUIDE.md](./COPILOT_LOCAL_TESTING_GUIDE.md) - Local test execution

---

**Deployment Status:** 🟡 Ready for Production Deployment  
**Security Status:** 🟢 Hardened (Auth Guards Enabled)  
**Next Action:** Deploy to Firebase Hosting and verify auth flow
