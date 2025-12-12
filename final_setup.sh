#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# --- GLOBAL VARIABLES ---
PROJECT_ROOT="/Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY"
SERVICE_KEY_FILE="rpr-verify-b-9b59a4994dee.json"
# The verified local path to the key
KEY_PATH="/Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/GOOGLE-AUTH/$SERVICE_KEY_FILE" 

echo "--- Starting FINAL Project Setup and Deployment ---"
cd $PROJECT_ROOT

# Check for uncommitted changes before proceeding with refactoring
if ! git diff-index --quiet HEAD --; then
    echo "ERROR: Uncommitted changes detected. Please commit or stash your work before running the setup."
    exit 1
fi

# --- PHASE 1: STRUCTURAL REFACTORING ---
echo "--- 1. Structural Refactoring (Monorepo Cleanup) ---"

# 1. Update .gitignore (security first)
echo "   - Updating .gitignore for security..."
cat >> .gitignore << 'EOF'

# Service Account Keys (Security)
**/service-account-key.json
**/*credentials*.json
**/*service-account*.json
backend/src/service-account-key.json
EOF

# 2. Create backend directory structure (if not already done)
echo "   - Creating backend directory structure: backend/src/modules"
mkdir -p backend/src/modules

# 3. Move backend root files (using git mv to preserve history)
echo "   - Moving backend root files (Dockerfile, requirements.txt, flask_app.py)"
git mv Dockerfile backend/
git mv requirements.txt backend/
git mv flask_app.py backend/

# 4. Move Python modules
echo "   - Moving Python modules from src/modules/ to backend/src/modules/"
git mv src/modules/__init__.py backend/src/modules/
git mv src/modules/document_processor.py backend/src/modules/
git mv src/modules/report_generator.py backend/src/modules/
git mv src/modules/audit_trail.py backend/src/modules/
git mv src/modules/mismatch_detector.py backend/src/modules/
git mv src/modules/dispute_manager.py backend/src/modules/

# 5. Cleanup empty directories
echo "   - Cleaning up empty directories..."
rm -rf src/modules/__pycache__
rmdir src/modules 2>/dev/null || true # Attempt to remove directory if empty

# --- PHASE 2: CONFIGURATION ALIGNMENT AND KEY PLACEMENT ---
echo "--- 2. Configuration Alignment and Key Placement ---"

# 1. Update .firebaserc (critical fix for Firebase CLI commands)
echo "   - Updating .firebaserc to target rpr-verify-b..."
# This uses 'sed' to replace the old project ID with the new one
sed -i '' 's/gen-lang-client-0313233462/rpr-verify-b/g' .firebaserc

# 2. Copy the correct Service Account Key to the two required locations
echo "   - Copying correct Service Account Key to backend/src/ and functions/"
cp "$KEY_PATH" backend/src/service-account-key.json
cp "$KEY_PATH" functions/service-account-key.json

# --- PHASE 3: COMMIT AND DEPLOYMENT ---
echo "--- 3. Commit and Deployment ---"

# 1. Stage all structural, key, and config changes
echo "   - Staging and committing all changes..."
git add -A # Stage structural moves and .gitignore changes
# Ensure all manually edited files are also staged
git add .firebaserc
# Note: service-account-key.json files are intentionally not tracked (in .gitignore)

git commit -m "FINAL INTEGRATION: Completed monorepo structure, aligned .firebaserc/Firebase key to rpr-verify-b, and secured service account key."
git push origin main

# 2. Final Cloud Run redeploy (Required to ingest the new key and file structure)
echo "   - Starting final Cloud Run deployment..."
./cloud-deploy.sh

# 3. Final Vercel redeploy (Required to ensure the structure change is reflected)
echo "   - Starting final Vercel deployment..."
vercel --prod

echo "--- FINAL SETUP COMPLETE. CHECK LIVE URLS ---"
