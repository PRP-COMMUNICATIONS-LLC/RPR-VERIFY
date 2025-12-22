#!/bin/bash
# RPR-VERIFY Production Deployment Script

# 1. Configuration
PROJECT_ID="rpr-verify-b"
SERVICE_NAME="rpr-verify-backend"
REGION="asia-southeast1" # Updated to your primary region

echo "🚀 Starting Deployment for $SERVICE_NAME..."

# 2. Build and Push to Google Artifact Registry
# Note: We need to specify the directory 'backend/' for the build context
gcloud builds submit backend/ --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# 3. Deploy to Cloud Run
# Fixed: Corrected ALLOWED_ORIGINS syntax and Secret Manager mapping
gcloud run deploy $SERVICE_NAME \
  --project=$PROJECT_ID \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars=ALLOWED_ORIGINS=https://verify.rprcomms.com\,https://rpr-verify.web.app \
  --update-secrets=GEMINI_API_KEY=gemini-api-key:latest \
  --update-env-vars "NOTION_TOKEN=$NOTION_TOKEN" \
  --update-env-vars "RPR_VERIFY_TASK_DB_ID=2d0883cd4fa18107ad7be91ceabcbd79" \
  --service-account=rpr-verify-backend@rpr-verify-b.iam.gserviceaccount.com \
  --memory 1Gi \
  --timeout 300

# 4. Extract Backend URL
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo "✅ Backend Deployed to: $BACKEND_URL"
