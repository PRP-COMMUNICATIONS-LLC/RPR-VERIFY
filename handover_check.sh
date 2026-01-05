#!/bin/bash
echo "🔍 Checking Sovereign Readiness..."

# Check for the correct Notion target in the workflow
if grep -q "Backend API Hardening" .github/workflows/firebase-deploy.yml; then
    echo "✅ [PASS] Notion target is set to: Backend API Hardening"
else
    echo "⚠️ [WARN] Notion target is still set to UI Alignment"
fi

# Check for the Tab 3 active class in the SCSS
if grep -q "active-verify" frontend/src/styles.scss; then
    echo "✅ [PASS] CSS Override exists in global styles"
else
    echo "❌ [FAIL] CSS Override missing from global styles"
fi

echo "🚀 Local URL: http://localhost:4200"