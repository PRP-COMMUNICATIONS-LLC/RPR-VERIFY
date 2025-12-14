#!/bin/bash
# File: scripts/02_local_backend_test.sh
# Description: Test Flask server and PDF generation locally

set -e

echo "🧪 PHASE 2: Local Backend Testing"
echo "=================================="

cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY/backend

echo "🚀 Step 2.1: Start Flask server (background)"
python flask_app.py &
FLASK_PID=$!

echo "⏳ Step 2.2: Wait 5 seconds for server startup"
sleep 5

echo "✅ Step 2.3: Test health endpoint"
curl http://localhost:8080/health

echo ""
echo "📄 Step 2.4: Test HTML format (existing)"
curl -o test_html.json "http://localhost:8080/api/reports/cis/TEST-CASE-001"
cat test_html.json

echo ""
echo "📥 Step 2.5: Test PDF format (NEW)"
curl -o test_output.pdf "http://localhost:8080/api/reports/cis/TEST-CASE-001?format=pdf"

echo ""
echo "🔍 Step 2.6: Verify PDF file"
file test_output.pdf
ls -lh test_output.pdf

echo ""
echo "🛑 Step 2.7: Stop Flask server"
kill $FLASK_PID

echo "✅ PHASE 2 COMPLETE: Local testing successful"
echo ""
echo "Expected results:"
echo "  - test_html.json: Contains HTML in 'summary_text'"
echo "  - test_output.pdf: Valid PDF document"
echo ""
echo "Next: Run scripts/03_docker_validation.sh"
