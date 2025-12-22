#!/bin/bash

# ============================================================================
# RPR-VERIFY CLOUD RUN DEPLOYMENT
# Google Cloud Project: rpr-verify-b
# Region: asia-southeast1 (Singapore)
# Service Name: rpr-verify
# ============================================================================

set -e  # Exit on any error

PROJECT_ID="rpr-verify-b"
SERVICE_NAME="rpr-verify"
REGION="asia-southeast1"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/cloud-run-repo/${SERVICE_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

print_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Validate we're in the correct directory
if [ ! -f "backend/Dockerfile" ]; then
    print_error "Dockerfile not found in backend/ directory!"
    print_info "Please run this script from: RPR-VERIFY/"
    exit 1
fi

if [ ! -f "backend/flask_app.py" ]; then
    print_error "flask_app.py not found in backend/ directory!"
    print_info "Please run this script from: RPR-VERIFY/"
    exit 1
fi

if [ ! -f "backend/requirements.txt" ]; then
    print_error "requirements.txt not found in backend/ directory!"
    exit 1
fi

print_success "Directory validation passed"
echo ""
print_info "🚀 Starting deployment..."
print_info "Project ID: $PROJECT_ID"
print_info "Service: $SERVICE_NAME"
print_info "Region: $REGION"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed!"
    print_info "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if docker is installed and running
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker daemon is not running!"
    exit 1
fi

# Authenticate with Google Cloud (if not already authenticated)
echo ""
print_info "🔐 Checking Google Cloud authentication..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_warn "Not authenticated. Starting authentication..."
    gcloud auth login
else
    print_success "Already authenticated"
fi

# Set the project
echo ""
print_info "📁 Setting Google Cloud project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo ""
print_info "🔧 Enabling required Google Cloud APIs..."
gcloud services enable run.googleapis.com --quiet
gcloud services enable artifactregistry.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet

# Create artifact registry repository (if not exists)
echo ""
print_info "📦 Ensuring artifact registry repository exists..."
if gcloud artifacts repositories describe cloud-run-repo \
    --location=$REGION &> /dev/null; then
    print_success "Repository already exists"
else
    print_info "Creating repository..."
    if gcloud artifacts repositories create cloud-run-repo \
      --repository-format=docker \
      --location=$REGION \
      --description="Cloud Run Docker images" 2>/dev/null; then
        print_success "Repository created"
    else
        print_warn "Repository may already exist, continuing..."
    fi
fi

# Configure Docker authentication
echo ""
print_info "🔑 Configuring Docker authentication..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# Build the Docker image for Cloud Run (linux/amd64)
echo ""
print_info "🔨 Building Docker image for Cloud Run (linux/amd64)..."
print_info "This may take a few minutes..."
# Build from backend/ directory with Dockerfile in backend/
docker build --platform linux/amd64 -f backend/Dockerfile -t ${IMAGE_NAME}:latest backend/
docker build --platform linux/amd64 -f backend/Dockerfile -t ${IMAGE_NAME}:v1.0-production backend/

if [ $? -ne 0 ]; then
    print_error "Docker build failed!"
    exit 1
fi

print_success "Docker image built successfully"

# Push to artifact registry
echo ""
print_info "📤 Pushing image to artifact registry..."
docker push ${IMAGE_NAME}:latest
docker push ${IMAGE_NAME}:v1.0-production

if [ $? -ne 0 ]; then
    print_error "Docker push failed!"
    exit 1
fi

print_success "Image pushed successfully"

# Deploy to Cloud Run
echo ""
print_info "☁️  Deploying to Cloud Run..."
print_info "This may take 2-5 minutes..."

gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 100 \
  --quiet

if [ $? -ne 0 ]; then
    print_error "Cloud Run deployment failed!"
    exit 1
fi

# Get the service URL
echo ""
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format='value(status.url)' 2>/dev/null)

if [ -z "$SERVICE_URL" ]; then
    print_error "Could not retrieve service URL"
    exit 1
fi

# Final success message
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "SERVICE DEPLOYED SUCCESSFULLY!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "📌 Service URL: $SERVICE_URL"
print_info "📌 Region: $REGION"
print_info "📌 Service Name: $SERVICE_NAME"
echo ""
print_info "🧪 Test the health endpoint:"
echo "   curl $SERVICE_URL/health"
echo ""
print_info "📊 View logs:"
echo "   gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50"
echo ""
print_info "🔍 View service details:"
echo "   gcloud run services describe $SERVICE_NAME --region $REGION"
echo ""
