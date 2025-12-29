# OPS CHECKLIST — Target Project A Deployment

This checklist covers the minimal, high-impact steps to deploy the backend for Target Project A and verify the Escalation Dashboard end-to-end.

## 1) CORS
- Set the `ALLOWED_ORIGINS` environment variable on the Cloud Run service to include the new frontend hosting URL and local dev origin, e.g.:
  - `ALLOWED_ORIGINS="https://PROJECT-A-NEW-HOSTING.web.app,http://localhost:4200"`
- Confirm startup logs show the configured origins (`🔒 CORS allowed origins:`) from `flask_app.py`.

## 2) OAuth / Firebase
- Ensure the OAuth client (OAuth 2.0 Client ID) belongs to **Target Project A** and that its authorized origins / redirect URIs include the new Firebase hosting URL.
- Verify Firebase settings (projectId, API key) in `src/environments/environment.prod.ts` or deployment secrets match Target Project A.

## 3) Service Accounts & Secrets
- Provision required service accounts (e.g., for Google Drive, Cloud Run runtime) in Target Project A and grant minimum necessary IAM roles.
- Wire sensitive credentials into Cloud Run using Secret Manager or environment variables (do not commit credentials to repo).

## 4) Smoke Test (End-to-end)
- Deploy backend to Cloud Run with `ALLOWED_ORIGINS` set.
- Deploy frontend to Firebase hosting for Project A and visit the site.
  - Login (verify OAuth flow works), open Escalation Dashboard, and confirm data loads without CORS/auth errors.
- Check backend logs for any 401/403 or CORS rejections and resolve as needed.

## References
- Deployment guidance: `backend/CORS_DEPLOYMENT.md`
- Audit & handoff: `REPORTS/PHASE3_NETWORK_ALIGNMENT_COMPLETE.md`

---
*Created for: RPR-VERIFY migration to Target Project A — 2025-12-16*
