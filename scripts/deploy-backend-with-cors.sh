#!/bin/bash
# RPR-VERIFY Backend Deployment with CORS Configuration
# This script deploys the backend to Cloud Run with proper CORS settings
# Uses virtual environment to avoid root user warnings and ensure clean isolation

set -e

# Configuration
PROJECT_ID="rpr-verify-b"
SERVICE_NAME="rpr-verify-backend"
REGION="asia-southeast1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
SERVICE_ACCOUNT="jules-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

# Get the script directory to ensure we're in the right location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_ROOT}"

echo "🚀 Deploying ${SERVICE_NAME} with CORS configuration..."
echo "=================================================="
echo "Service Account: ${SERVICE_ACCOUNT}"
echo ""

# Step 0: Set up isolated Python environment for any local operations
echo "🐍 Step 0: Setting up isolated Python environment..."
if [ ! -d "venv" ]; then
    echo "   Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip and install requirements (for local testing/verification)
echo "   Installing Python dependencies in isolated environment..."
pip install --upgrade pip --quiet
if [ -f "backend/requirements.txt" ]; then
    pip install -r backend/requirements.txt --quiet
fi

# Step 1: Build and push Docker image
echo ""
echo "📦 Step 1: Building and pushing Docker image..."
echo "   (Docker build uses its own isolated environment - no root warnings)"
gcloud builds submit --tag ${IMAGE_NAME} backend/

# Step 2: Deploy to Cloud Run with CORS environment variables
echo ""
echo "☁️  Step 2: Deploying to Cloud Run with CORS configuration..."
gcloud run deploy ${SERVICE_NAME} \
  --project=${PROJECT_ID} \
  --image=${IMAGE_NAME} \
  --platform=managed \
  --region=${REGION} \
  --allow-unauthenticated \
  --set-env-vars="^;^ALLOWED_ORIGINS=http://localhost:4200,https://verify.rprcomms.com,https://www.rprcomms.com,https://rpr-verify-b.web.app,https://rpr-verify.web.app" \
  --update-secrets=GEMINI_API_KEY=gemini-api-key:latest \
  --service-account=${SERVICE_ACCOUNT} \
  --memory=1Gi \
  --timeout=300 \
  --max-instances=10 \
  --min-instances=0

# Step 3: Extract service URL
echo ""
echo "🔗 Step 3: Retrieving service URL..."
BACKEND_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --project=${PROJECT_ID} \
  --platform=managed \
  --region=${REGION} \
  --format='value(status.url)')

echo ""
echo "✅ Deployment Complete!"
echo "=================================================="
echo "Service URL: ${BACKEND_URL}"
echo ""

# Step 4: Optional verification (using venv to avoid root warnings)
read -p "🔍 Run CORS verification test? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🧪 Step 4: Running CORS verification (using isolated venv)..."
    if [ -f "backend/test_cors_verification.py" ]; then
        python backend/test_cors_verification.py "${BACKEND_URL}"
    else
        echo "   ⚠️  Verification script not found, skipping..."
    fi
fi

echo ""
echo "📋 Next Steps:"
echo "1. Test CORS preflight manually:"
echo "   curl -v -X OPTIONS ${BACKEND_URL}/health \\"
echo "     -H \"Origin: http://localhost:4200\" \\"
echo "     -H \"Access-Control-Request-Method: GET\""
echo ""
echo "2. Run verification script (if not run above):"
echo "   source venv/bin/activate"
echo "   python backend/test_cors_verification.py ${BACKEND_URL}"
echo ""
echo "3. Verify service account permissions:"
echo "   gcloud projects get-iam-policy ${PROJECT_ID} \\"
echo "     --flatten=\"bindings[].members\" \\"
echo "     --filter=\"bindings.members:serviceAccount:${SERVICE_ACCOUNT}\""
echo ""
echo "💡 Note: Virtual environment is active. Run 'deactivate' to exit when done."
