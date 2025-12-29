#!/bin/bash
# -----------------------------------------------------------------------------
# RPR-VERIFY Phase 3 Final Backend Deployment Script
# -----------------------------------------------------------------------------

# --- Configuration ---
PROJECT_ID="rpr-verify-b"
SERVICE_NAME="rpr-verify"
REGION="asia-southeast1"
SOURCE_DIR="functions/"
# Memory and timeout settings confirmed during previous steps
MEMORY="2048Mi"
TIMEOUT="60s"

# --- Step 1: Get Master Folder ID ---
echo "--- Google Drive Setup ---"

# Check if folder ID is provided as environment variable or command line argument
if [ -n "$1" ]; then
    RPR_DRIVE_MASTER_FOLDER_ID="$1"
    echo "Using folder ID from command line argument."
elif [ -n "$RPR_DRIVE_MASTER_FOLDER_ID" ]; then
    echo "Using folder ID from environment variable."
else
    echo "Please enter the MASTER FOLDER ID (the unique string from the RPR Jobs folder URL)."
    read -p "MASTER_FOLDER_ID: " RPR_DRIVE_MASTER_FOLDER_ID
fi

if [ -z "$RPR_DRIVE_MASTER_FOLDER_ID" ]; then
    echo "❌ Error: Master Folder ID cannot be empty. Deployment aborted."
    echo "Usage: $0 [MASTER_FOLDER_ID]"
    echo "   or: RPR_DRIVE_MASTER_FOLDER_ID=<id> $0"
    exit 1
fi

echo "--- Deployment ---"
echo "Deploying service $SERVICE_NAME to project $PROJECT_ID..."
echo "Setting RPR_DRIVE_MASTER_FOLDER_ID=$RPR_DRIVE_MASTER_FOLDER_ID"

# --- Step 2: Deploy the Service with the Environment Variable ---
gcloud run deploy "$SERVICE_NAME" \
  --source "$SOURCE_DIR" \
  --platform managed \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --allow-unauthenticated \
  --memory "$MEMORY" \
  --timeout "$TIMEOUT" \
  --set-env-vars RPR_DRIVE_MASTER_FOLDER_ID="$RPR_DRIVE_MASTER_FOLDER_ID" \
  --quiet

if [ $? -eq 0 ]; then
  echo "✅ Deployment SUCCESSFUL. New code is live."
else
  echo "❌ Deployment FAILED. Check gcloud logs for details."
  exit 1
fi

# --- Step 3: Verification ---
echo ""
echo "--- Verification ---"
CLOUD_RUN_URL=$(gcloud run services describe $SERVICE_NAME --project $PROJECT_ID --region $REGION --platform managed --format='value(status.url)')
echo "Cloud Run URL: $CLOUD_RUN_URL"
echo "Running health check..."
curl -s -X GET "$CLOUD_RUN_URL/health" | jq -r '.'

echo ""
echo "Backend deployment process complete."
