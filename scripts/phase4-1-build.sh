#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 PHASE 4.1: BUILDING ANGULAR APPLICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "[Step 1/4] Checking environment..."
if [ ! -f "src/environments/environment.prod.ts" ]; then
    echo "❌ Production environment file not found!"
    exit 1
fi
echo "✅ Environment file verified"
echo ""

echo "[Step 2/4] Cleaning previous build..."
rm -rf dist/ .angular/cache/
echo "✅ Cleaned build artifacts"
echo ""

echo "[Step 3/4] Installing dependencies..."
npm install
echo "✅ Dependencies ready"
echo ""

echo "[Step 4/4] Building for production..."
npm run build
echo ""
echo "✅ Build complete!"
echo ""
echo "Next: Run 'bash scripts/phase4-2-deploy.sh' to deploy"
