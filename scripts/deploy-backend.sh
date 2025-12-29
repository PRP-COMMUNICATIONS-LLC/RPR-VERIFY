#!/bin/bash
# RPR-VERIFY Production Deployment Script

# 1. Configuration
PROJECT_ID="rpr-verify-b"
SERVICE_NAME="rpr-verify-backend"
REGION="asia-southeast1" 
NOTION_DB_ID="2d0883cd4fa18107ad7be91ceabcbd79"

echo "🚀 Starting Deployment for $SERVICE_NAME..."

# 2. Build and Push to Google Artifact Registry
# We specify the backend/ directory to ensure the Dockerfile is found from the root
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME backend/

# 3. Deploy to Cloud Run
# Fixed: Using custom delimiter ^;^ to handle commas in ALLOWED_ORIGINS
gcloud run deploy $SERVICE_NAME \
  --project=$PROJECT_ID \
  --image=gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform=managed \
  --region=$REGION \
  --allow-unauthenticated \
  --set-env-vars="^;^ALLOWED_ORIGINS=https://verify.rprcomms.com,https://rpr-verify.web.app;NOTION_TOKEN=$NOTION_TOKEN;RPR_VERIFY_TASK_DB_ID=$NOTION_DB_ID" \
  --update-secrets=GEMINI_API_KEY=gemini-api-key:latest \
  --service-account=rpr-verify-backend@rpr-verify-b.iam.gserviceaccount.com \
  --memory=1Gi \
  --timeout=300

# 4. Extract Backend URL
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo "✅ Backend Deployed to: $BACKEND_URL"
