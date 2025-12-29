#!/bin/bash

# RPR-VERIFY Backend Local Dev Launcher
# Usage: ./scripts/local-dev-backend.sh
# Working Directory: /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

echo "🚀 Starting RPR-VERIFY Backend (Local)..."

# Ensure we are in the backend directory
cd backend || { echo "❌ 'backend' directory not found"; exit 1; }

# Create venv if missing
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
if [ -f "requirements.txt" ]; then
    echo "⬇️ Installing dependencies..."
    pip install -r requirements.txt
else
    echo "⚠️ No requirements.txt found!"
fi

# Verify Vertex AI SDK is installed
python3 -c "import vertexai; print('✅ vertexai module available')" || {
    echo "❌ google-cloud-aiplatform not installed. Adding to requirements.txt..."
    echo "google-cloud-aiplatform>=1.38.0" >> requirements.txt
    pip install -r requirements.txt
}

# Set Local Environment Variables
export GOOGLE_CLOUD_PROJECT="rpr-verify-b"
export PORT=8080
export FLASK_DEBUG=1

# Run the App
echo "✅ Server running at http://localhost:8080"
python3 main.py

