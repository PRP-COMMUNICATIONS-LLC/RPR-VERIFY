#!/bin/bash
# RPR-VERIFY Singapore Engine Smoke Test
# Run this after GitHub Actions deployment completes

# Replace with the URL provided by the GitHub Action output
# Format: https://rpr-verify-backend-xxxx-as.a.run.app
LIVE_URL="${1:-https://rpr-verify-backend-xxxx-as.a.run.app}"

echo "🔍 Testing Singapore Engine Health..."
echo "📍 Target URL: $LIVE_URL"
echo ""

# Test 1: Health endpoint
echo "1️⃣ Testing /api/health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$LIVE_URL/api/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check passed (HTTP $HTTP_CODE)"
    echo "Response: $HEALTH_BODY"
else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    echo "Response: $HEALTH_BODY"
    exit 1
fi

echo ""

# Test 2: OCR health endpoint
echo "2️⃣ Testing /api/ocr-health endpoint..."
OCR_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$LIVE_URL/api/ocr-health")
OCR_HTTP_CODE=$(echo "$OCR_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
OCR_BODY=$(echo "$OCR_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$OCR_HTTP_CODE" = "200" ]; then
    echo "✅ OCR health check passed (HTTP $OCR_HTTP_CODE)"
    echo "Response: $OCR_BODY"
else
    echo "⚠️  OCR health check returned HTTP $OCR_HTTP_CODE"
    echo "Response: $OCR_BODY"
fi

echo ""

# Test 3: Verify service is accessible
echo "3️⃣ Testing service accessibility..."
if curl -s -f -o /dev/null "$LIVE_URL/api/health"; then
    echo "✅ Service is accessible and responding"
else
    echo "❌ Service is not accessible"
    exit 1
fi

echo ""
echo "🎉 Singapore Engine smoke test complete!"
echo "💡 To test with a custom URL, run: ./test-singapore.sh https://your-custom-url.run.app"
