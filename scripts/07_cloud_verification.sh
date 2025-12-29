#!/bin/bash
# File: scripts/07_cloud_verification.sh
# Description: Test live Cloud Run endpoint

set -e

echo "🔍 PHASE 7: Cloud Verification"
echo "==============================="

SERVICE_URL="https://rpr-verify-794095666194.asia-southeast1.run.app"

echo "✅ Step 7.1: Test health endpoint"
curl ${SERVICE_URL}/health

echo ""
echo "📄 Step 7.2: Test HTML format"
curl "${SERVICE_URL}/api/reports/cis/TEST-CASE-001"

echo ""
echo "📥 Step 7.3: Test PDF format"
curl -o cloud_test.pdf "${SERVICE_URL}/api/reports/cis/TEST-CASE-001?format=pdf"
file cloud_test.pdf
ls -lh cloud_test.pdf

echo "✅ PHASE 7 COMPLETE: Cloud backend verified"
echo ""
echo "Next: Update frontend environment and deploy"
