#!/bin/bash
set -euo pipefail

PRIMARY_URL="https://rpr-verify-b.web.app"
SECONDARY_URL="https://rpr-verify-b.firebaseapp.com"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PHASE 4.3: VERIFYING FIREBASE HOSTING DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "[1/3] Checking HTTP status..."
for URL in "$PRIMARY_URL" "$SECONDARY_URL"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
  echo "  $URL -> $CODE"
done
echo ""

echo "[2/3] Checking HTML & Angular app..."
HTML=$(curl -s "$PRIMARY_URL" || true)
if echo "$HTML" | grep -q "<title>"; then
  echo "✅ <title> tag present"
else
  echo "⚠️ No <title> tag detected"
fi
if echo "$HTML" | grep -q "app-root"; then
  echo "✅ app-root element found (Angular bootstrapped)"
else
  echo "⚠️ app-root not detected"
fi
echo ""
echo "[3/3] Basic header check..."
curl -sI "$PRIMARY_URL" | sed -n '1,10p'
echo ""
echo "Manual checks:"
echo "  - Open $PRIMARY_URL in a browser"
echo "  - Test auth and key user flows"
