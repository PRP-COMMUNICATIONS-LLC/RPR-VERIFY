#!/bin/bash
echo "🔍 Checking Sovereign Readiness..."

# Check for the correct Notion target in the workflow
if grep -q "UI Branding Alignment" .github/workflows/firebase-deploy.yml; then
    echo "✅ [PASS] Notion target is set to: UI Branding Alignment"
else
    echo "⚠️ [WARN] Notion target is not set to UI Branding Alignment"
fi

# Verify that the maintainable class-based fix is present
if grep -q "active-verify" frontend/src/app/app.component.scss; then
    echo "✅ [PASS] CSS Override exists via .active-verify class"
else
    echo "❌ [FAIL] CSS Override (.active-verify) missing"
fi

echo "🚀 Local URL: http://localhost:4200"
