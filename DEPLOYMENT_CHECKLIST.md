# RPR-VERIFY Deployment Checklist

## Critical Friction Points - Standby Protocol

### ⚠️ FRICTION POINT 1: Dependency Alignment

**Issue**: @angular/fire version compatibility with Angular 19
**Status**: ✅ RESOLVED

* Updated `package.json` to use `@angular/fire: ^19.0.0` to match Angular 19.
* **Action Required**: Run `npm install` in frontend directory to verify compatibility.
* **Verification**: Check for linter regressions after installation.

```bash
cd frontend
npm install
npm run build  # Verify no TypeScript/linter errors

```

### ⚠️ FRICTION POINT 2: Resource Persistence

**Issue**: Cloud Run memory allocation preventing "Death Spiral" state
**Status**: ⚠️ VERIFICATION REQUIRED

* **CRITICAL**: The `--memory 2Gi` flag is **NON-NEGOTIABLE**.
* This prevents Singapore instance from reverting to unstable state.
* **Action Required**: Verify all deployment commands include `--memory 2Gi`.

#### Correct Deployment Command

```bash
cd backend
gcloud run deploy rpr-verify \
  --source . \
  --memory 2Gi \
  --cpu 1 \
  --timeout 300 \
  --region asia-southeast1 \
  --project rpr-verify-b \
  --allow-unauthenticated

```

#### ⚠️ Script Audit Results

* ✅ `scripts/06_cloud_backend_deploy.sh` — Has `--memory 2Gi`
* ❌ `scripts/deploy-backend-fixed.sh` — Has `--memory 1Gi` (NEEDS UPDATE)

## Deployment Sequence

### Step 1: Frontend Dependency Installation

```bash
cd frontend
npm install

```

**Verify**:

* No peer dependency warnings for @angular/fire.
* No TypeScript compilation errors.
* Linter passes without regressions.

### Step 2: Backend Deployment

```bash
cd backend
gcloud run deploy rpr-verify \
  --source . \
  --memory 2Gi \
  --cpu 1 \
  --timeout 300 \
  --region asia-southeast1 \
  --project rpr-verify-b \
  --allow-unauthenticated

```

**Verify**:

* ✅ `--memory 2Gi` flag is present (CRITICAL).
* Deployment completes without errors.
* Health endpoint responds: `GET https://[SERVICE_URL]/health`.

### Step 3: Frontend Build & Deploy

```bash
cd frontend
npm run build
firebase deploy --only hosting

```

## Post-Deployment Verification

1. **Backend Health Check**

```bash
curl https://rpr-verify-7kzxnscuuq-as.a.run.app/health

```

Expected: `{"status": "peacetime", "color": "#00E0FF"}`

1. **Frontend Integration Test**

* Navigate to frontend application.
* Verify Firebase authentication works.
* Test report generation endpoint.
* Verify CSS variables update on escalation.

1. **Memory Allocation Verification**

```bash
gcloud run services describe rpr-verify \
  --region asia-southeast1 \
  --project rpr-verify-b \
  --format="value(spec.template.spec.containers[0].resources.limits.memory)"

```

Expected: `2Gi`

## Rollback Procedure

If deployment fails:

1. Check Cloud Run logs: `gcloud run services logs read rpr-verify --region asia-southeast1`
1. Vgcloud builds submit --tag gcr.io/rpr-verify-b/rpr-verify:latest . 2>&1 | grep -E "(Step|Successfully|ERROR|PUSH)" | tail -15y memory allocation: Must be 2Gi.
1. Check frontend build logs for @angular/fire compatibility issues.
1. Rollback to previous revision if needed:

```bash
gcloud run services update-traffic rpr-verify \
  --to-revisions=[PREVIOUS_REVISION]=100 \
  --region asia-southeast1

```

---

### 🚦 Operational Pulse

This remediated file should now clear the `markdownlint` errors in Cursor.
