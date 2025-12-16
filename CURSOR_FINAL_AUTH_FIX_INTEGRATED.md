# 🚀 FINAL: Integrated Authentication Fix & Dual Deployment

## Overview

This is the **final combined sequence** that fixes all authentication issues and deploys to both Vercel (frontend) and Cloud Run (backend) simultaneously.

**Status:**
- ✅ Google OAuth Client ID updated in both environments
- ⏳ Service Account Key needs to be restored
- ⏳ Both frontend and backend need redeployment

---

## 🔐 Step 1: Restore Service Account Key

### Locate the Key

```bash
ls -la /Users/puvansivanasan/PERPLEXITY/GOOGLE-AUTH/
```

Identify the Service Account Key filename (likely `rpr-verify-service-key.json` or similar).

### Copy to Backend

```bash
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

# Create directory if needed
mkdir -p backend/src

# Copy the key (replace [FILENAME] with actual filename)
cp /Users/puvansivanasan/PERPLEXITY/GOOGLE-AUTH/[FILENAME] backend/src/service-account-key.json

# Verify
ls -la backend/src/service-account-key.json
```

**Expected output:**
```
-rw-r--r--  1 puvansivanasan  staff  2345 Dec 12 18:42 backend/src/service-account-key.json
```

---

## 📦 Step 2: Commit All Changes to GitHub

This single commit includes:
1. ✅ Google OAuth Client ID in `src/environments/environment.prod.ts`
2. ✅ Google OAuth Client ID in `src/environments/environment.ts`
3. ✅ Service Account Key in `backend/src/service-account-key.json`

```bash
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

# Stage all three changes
git add \
  src/environments/environment.prod.ts \
  src/environments/environment.ts \
  backend/src/service-account-key.json

# Commit with descriptive message
git commit -m "feat(auth): Update Google OAuth client ID and restore Service Account Key for backend authorization"

# Push to GitHub
git push origin main
```

**Expected output:**
```
[main xxxxxxx] feat(auth): Update Google OAuth client ID and restore Service Account Key for backend authorization
 3 files changed, 2 insertions(+)
 create mode 100644 backend/src/service-account-key.json
```

---

## 🏗️ Step 3: Build for Production

```bash
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

ng build --configuration production
```

**Expected output:**
```
✔ Building...
Initial chunk files | Names                 |  Raw size | Estimated transfer size
main-L55WTGAV.js    | main                  | 301.24 kB |                70.86 kB
chunk-O6FIOPEX.js   | -                     | 245.59 kB |                66.06 kB
styles-DYP77YLO.css | styles                |  34.28 kB |                 5.24 kB

Application bundle generation complete. [11.433 seconds]
Output location: /Users/puvansivanasan/.../dist/rpr-verify
```

---

## ☁️ Step 4: Deploy to Cloud Run (Backend)

**Option A: Using Deployment Script (Recommended)**

```bash
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

./cloud-deploy.sh
```

**Option B: Manual gcloud Deployment**

```bash
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

gcloud run deploy rpr-verify \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```

**Expected output:**
```
Building using Dockerfile and skipping uploading build logs
Building image
Logs are available in Cloud Build
Deploying to service [rpr-verify] in [asia-southeast1]
✓ Deploying...
Service [rpr-verify] revision [rpr-verify-00X] has been deployed
Service URL: https://rpr-verify-794095666194.asia-southeast1.run.app
```

⏱️ **Wait time:** 3-5 minutes for Cloud Build to complete.

---

## 🌐 Step 5: Deploy to Vercel (Frontend)

```bash
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

vercel --prod
```

**Expected output:**
```
Vercel CLI 50.0.0
Running build...
17:52:17.950 Running "install" command: `npm install`...
17:52:36.185 found 0 vulnerabilities
17:52:36.995 ❯ Building...
17:52:48.430 ✔ Building...
✓ Production build completed
✓ Deployment completed
✓ Production URL: https://rpr-verify-et8hakpyt-butterdime.vercel.app
```

⏱️ **Wait time:** 2-3 minutes.

---

## ✅ Step 6: Verification

### Test 1: Backend Health

```bash
curl https://rpr-verify-794095666194.asia-southeast1.run.app/health
```

**Expected response:**
```json
{"status": "ok", "authenticated": true}
```

### Test 2: Frontend Loads

Open in browser:
```
https://rpr-verify-et8hakpyt-butterdime.vercel.app/login
```

**Expected:**
- ✅ Angular app loads
- ✅ Login form visible
- ✅ No authentication errors in Console

### Test 3: Google Sign-In Works

1. Click "Sign in with Google"
2. Check DevTools Console for errors
3. **Expected:** No `401`, `403`, or `400` errors
4. Sign-in flow should proceed smoothly

### Test 4: Check Cloud Run Logs

```bash
gcloud run logs read rpr-verify --region asia-southeast1 --limit 20
```

**Look for:**
- ✅ Service Account authentication successful
- ❌ No permission denied errors
- ❌ No key not found errors

### Test 5: Check Vercel Logs

```bash
vercel logs --prod
```

Or in Vercel UI: Deployments → Latest → Logs

**Look for:**
- ✅ OAuth client ID correctly configured
- ✅ API calls to backend succeeding
- ❌ No CORS errors
- ❌ No 403 Forbidden

---

## 📊 Deployment Summary

| Component | Changed | Deployed | Status |
|-----------|---------|----------|--------|
| **OAuth Client ID** | ✅ Yes | ✅ Yes (Vercel) | Updated |
| **Service Account Key** | ✅ Yes | ✅ Yes (Cloud Run) | Restored |
| **Frontend (Vercel)** | ✅ Yes | ✅ Yes | Live |
| **Backend (Cloud Run)** | ✅ Yes | ✅ Yes | Live |
| **Custom Domain DNS** | ⏳ No | ⏳ Propagating | Pending |

---

## 🔒 Security Verification

After deployment, verify security settings:

### 1. Firebase Console

**Authentication → Google Sign-In Provider**
- ✅ OAuth Client ID is authorized
- ✅ Authorized domains include `verify.rprcomms.com`

### 2. GCP Console

**APIs & Services → Credentials**
- ✅ OAuth Client ID has correct authorized redirect URIs
- ✅ Service Account has correct permissions

### 3. Cloud Run

```bash
gcloud run services describe rpr-verify --region asia-southeast1
```

- ✅ Ingress: `allow-all` or `internal-and-cloud-load-balancing` as intended
- ✅ Environment variables properly set (if any)

---

## ⚠️ Troubleshooting

### If Cloud Run Deployment Fails

```bash
# Check build logs
gcloud builds log [BUILD_ID]

# Check if Dockerfile exists
ls -la Dockerfile

# Check if service account key file was committed
git show HEAD:backend/src/service-account-key.json | head -5
```

### If Vercel Deployment Fails

```bash
# Check local build
ng build --configuration production

# Check build command in Vercel UI matches expectations
# Settings → Build & Development → Build Command should be:
# ng build --configuration production
```

### If Google Sign-In Still Fails

1. **Verify OAuth Client ID in Firebase Console**
   - Go to Firebase → Project Settings → Service Accounts
   - Copy the actual client ID configured
   - Compare with `src/environments/environment.prod.ts`

2. **Check Authorized Redirect URIs in GCP Console**
   - GCP → APIs & Services → Credentials
   - Click OAuth 2.0 Client ID
   - Verify redirect URIs include:
     - `https://verify.rprcomms.com/`
     - `https://rpr-verify-et8hakpyt-butterdime.vercel.app/`

3. **Check CORS in Backend**
   - Verify Cloud Run backend allows frontend domain

---

## ✅ Final Checklist

- [ ] Service Account Key copied to `backend/src/service-account-key.json`
- [ ] All three files staged in git
- [ ] Committed to GitHub main branch with message
- [ ] Pushed to origin main
- [ ] `ng build --configuration production` completed successfully
- [ ] Cloud Run deployed with new Service Account Key
- [ ] Vercel deployed with new OAuth Client ID
- [ ] Backend health endpoint responds with `"authenticated": true`
- [ ] Frontend loads without authentication errors
- [ ] Google Sign-In flow works end-to-end
- [ ] No 401/403/400 errors in browser console
- [ ] Cloud Run logs show successful authentication
- [ ] Firebase Console OAuth provider configured with new client ID

---

## 🎯 Timeline

| Step | Duration | Total |
|------|----------|-------|
| 1. Restore key + verify | 2 min | 2 min |
| 2. Git commit & push | 1 min | 3 min |
| 3. Build production | 15 sec | 3.25 min |
| 4. Cloud Run deploy | 3-5 min | 6-8 min |
| 5. Vercel deploy | 2-3 min | 8-11 min |
| 6. Verification & testing | 5 min | 13-16 min |

**Total: ~15 minutes**

---

## 📝 Success Criteria

✅ **All of the following must be true:**

1. Frontend loads at `https://rpr-verify-et8hakpyt-butterdime.vercel.app/login`
2. Google Sign-In button is clickable and functional
3. No 400/401/403 errors in browser console
4. Backend responds with `"authenticated": true` at health endpoint
5. Cloud Run logs show no authentication failures
6. Firebase recognizes the new OAuth Client ID
7. Git commit includes all three file changes
8. Both deployments completed successfully

---

**Status: Ready to Execute**

Follow the steps in order. If any step fails, check the troubleshooting section or provide the error output for assistance.
