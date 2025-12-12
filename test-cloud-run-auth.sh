#!/bin/bash
set -e

REGION="asia-southeast1" 
SERVICE_NAME="rpr-verify" 
GCP_PROJECT="rpr-verify-b"

SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --project $GCP_PROJECT \
    --format 'value(status.url)')

if [ -z "$SERVICE_URL" ]; then
    echo "ERROR: Could not find Cloud Run service URL for $SERVICE_NAME."
    exit 1
fi
echo "Service URL: $SERVICE_URL"

echo "Generating authentication token..."
AUTH_TOKEN=$(gcloud auth print-identity-token --audiences="$SERVICE_URL")

if [ -z "$AUTH_TOKEN" ]; then
    echo "ERROR: Could not generate identity token."
    exit 1
fi

echo -e "\n--- Test 1: Authenticated Health Check (/health) ---"
curl -X GET -H "Authorization: Bearer $AUTH_TOKEN" "$SERVICE_URL/health"

echo -e "\n--- Test 2: Authenticated Service Info (/info) ---"
curl -X GET -H "Authorization: Bearer $AUTH_TOKEN" "$SERVICE_URL/info"

echo -e "\n--- Test 3: Unauthorized Access Check (Should FAIL) ---"
curl -X GET "$SERVICE_URL/health" -s -o /dev/null -w "%{http_code}\n"
echo "Expected response code: 401 or 403"

echo -e "\n--- Authenticated Test Complete ---"
