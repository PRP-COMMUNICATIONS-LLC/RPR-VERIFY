#!/bin/bash
# File: scripts/05_local_e2e_test.sh
# Description: Test full pipeline locally

set -e

echo "🔗 PHASE 5: Local End-to-End Test"
echo "=================================="

cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

echo "🚀 Step 5.1: Start backend server (background)"
cd backend
python flask_app.py &
BACKEND_PID=$!
cd ..

sleep 5

echo "🚀 Step 5.2: Start frontend dev server (background)"
ng serve &
FRONTEND_PID=$!

sleep 10

echo "✅ Step 5.3: Backend running at http://localhost:8080"
echo "✅ Step 5.4: Frontend running at http://localhost:4200"
echo ""
echo "MANUAL TEST REQUIRED:"
echo "  1. Open http://localhost:4200/cases/TEST-CASE-001/cis-report"
echo "  2. Click 'Download PDF' button"
echo "  3. Verify PDF downloads automatically"
echo "  4. Verify no alert() appears"
echo ""
echo "Press ENTER when testing complete..."
read

echo "🛑 Stopping servers"
kill $BACKEND_PID $FRONTEND_PID

echo "✅ PHASE 5 COMPLETE: End-to-end test done"
echo ""
echo "Next: Run scripts/06_cloud_backend_deploy.sh"
