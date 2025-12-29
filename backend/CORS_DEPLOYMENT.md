# Backend CORS Deployment Notes

The backend service reads its allowed CORS origins from the `ALLOWED_ORIGINS` environment variable.

- **Environment Variable:** `ALLOWED_ORIGINS`
- **Format:** Comma-separated list of origins (no spaces required, spaces will be trimmed)
- **Default:** `http://localhost:4200` (used when the variable is not set; useful for local development)

Example (Project A):

```bash
export ALLOWED_ORIGINS="https://PROJECT-A-NEW-HOSTING.web.app,http://localhost:4200"
```

Make sure to set this variable in your deployment environment (Cloud Run, Kubernetes, etc.) prior to deploying the backend.

Note: Avoid using `*` in production values; prefer explicit hostnames for security and compliance.
