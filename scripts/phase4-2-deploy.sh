echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting --project rpr-verify-b
echo "✅ Deployment complete."
echo "Live URLs:"
echo "  https://rpr-verify-b.web.app"
echo "  https://rpr-verify-b.firebaseapp.com"
#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 PHASE 4.2: DEPLOYING TO FIREBASE HOSTING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1) Check build output
if [ -d "dist/rpr-verify/browser" ]; then
  BUILD_DIR="dist/rpr-verify/browser"
elif [ -d "dist/browser" ]; then
  BUILD_DIR="dist/browser"
  BUILD_DIR="dist/browser"
else
  echo "❌ Build output not found. Run phase4-1-build.sh first."
  exit 1
fi
echo "✅ Build directory: $BUILD_DIR"
echo ""

# 2) Check Firebase CLI
if ! command -v firebase >/dev/null 2>&1; then
  echo "❌ Firebase CLI not found. Install with: npm install -g firebase-tools"
  exit 1
fi
echo "✅ Firebase CLI detected"
echo ""

# 3) Check login & project
if ! firebase projects:list >/dev/null 2>&1; then
  echo "❌ Not logged in. Run: firebase login"
  exit 1
fi

if ! grep -q '"rpr-verify-b"' .firebaserc; then
  echo "❌ .firebaserc does not reference rpr-verify-b:"
  cat .firebaserc
  exit 1
fi
echo "✅ Firebase project configured: rpr-verify-b"
echo ""

# 4) Deploy
echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting --project rpr-verify-b
echo ""
echo "✅ Deployment complete."
echo "Live URLs:"
echo "  https://rpr-verify-b.web.app"
echo "  https://rpr-verify-b.firebaseapp.com"
