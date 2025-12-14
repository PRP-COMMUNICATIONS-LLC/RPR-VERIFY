#!/bin/bash
# File: scripts/06_cloud_backend_deploy.sh
# Description: Deploy to Cloud Run

set -e

echo "☁️ PHASE 6: Cloud Backend Deployment"
echo "====================================="

cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY/backend

PROJECT_ID="rpr-verify-b"
SERVICE_NAME="rpr-verify"
REGION="asia-southeast1"

echo "🔨 Step 6.1: Build and push Docker image via Cloud Build"
gcloud builds submit --tag asia-southeast1-docker.pkg.dev/${PROJECT_ID}/cloud-run-repo/${SERVICE_NAME}:latest

echo "🚀 Step 6.2: Deploy to Cloud Run (new revision)"
gcloud run deploy ${SERVICE_NAME} \
  --image asia-southeast1-docker.pkg.dev/${PROJECT_ID}/cloud-run-repo/${SERVICE_NAME}:latest \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300s \
  --min-instances 1 \
  --max-instances 100

echo "✅ PHASE 6 COMPLETE: Backend deployed to Cloud Run"
echo ""
echo "Next: Run scripts/07_cloud_verification.sh"
