#!/usr/bin/env bash
set -euo pipefail

# Configuration
PROJECT_ID="rpr-verify-b"
SERVICE_NAME="rpr-verify-backend"
REGION="asia-southeast1"
SERVICE_ACCOUNT="rpr-verify-backend@rpr-verify-b.iam.gserviceaccount.com"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
DOMAIN="verify.rprcomms.com"

echo "🚀 Deploying RPR-VERIFY Backend to Cloud Run..."

# Build and push Docker image
echo "📦 Building Docker image..."
# Navigate to the root of the workspace to ensure context is correct
cd "$(dirname "$0")/.."
gcloud builds submit backend/ \
  --project="${PROJECT_ID}" \
  --tag="${IMAGE_NAME}" \
  --timeout=20m

# Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --image="${IMAGE_NAME}" \
  --region="${REGION}" \
  --platform=managed \
  --service-account="${SERVICE_ACCOUNT}" \
  --allow-unauthenticated \
  --port=8080 \
  --memory=1Gi \
  --cpu=1 \
  --timeout=300 \
  --max-instances=10 \
  --min-instances=0 \
  --concurrency=80 \
  --set-env-vars="^|^ALLOWED_ORIGINS=https://verify.rprcomms.com,https://rpr-verify.web.app" \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest"

# Get service URL
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --format="value(status.url)")

echo "✅ Deployment complete!"
echo "🔗 Service URL: ${SERVICE_URL}"
echo ""
echo "📋 Next steps:"
echo "1. Map custom domain: gcloud run domain-mappings create --service=${SERVICE_NAME} --domain=${DOMAIN} --region=${REGION}"
echo "2. Update frontend API_BASE_URL to: https://${DOMAIN}"
echo "3. Run smoke tests (see below)"
