#!/bin/bash
# Authority: RPR-VERIFY Sovereign Constitution v12.4
set -e

echo "🚀 Deploying Hardened Vision Engine to Singapore (rpr-verify-b)..."

# 1. Version Control (Selective)
# Add all modified backend files for the release
git add backend/functions/requirements.txt backend/functions/vision_engine.py backend/tests/test_vision_engine.py

# Only commit if there are staged changes
if ! git diff --cached --quiet; then
    git commit -m "RELEASE: SG Node v12.4. Hardened logic & Lean dependencies."
    git push origin main
else
    echo "No relevant changes to commit."
fi

# 2. Regional Firebase Deployment
# Explicitly binding to project 'rpr-verify-b'
firebase deploy --only functions --project rpr-verify-b

echo "✅ Deployment Successful to asia-southeast1-rpr-verify-b"
