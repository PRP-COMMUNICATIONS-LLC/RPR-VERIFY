#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-https://verify.rprcomms.com}"
TEST_TOKEN="${FIREBASE_ID_TOKEN:-}"  # Set this in environment

echo "🧪 Running smoke tests against: ${BASE_URL}"
echo ""

# Test 1: Health check (unauthenticated)
echo "1️⃣ Health check..."
HEALTH=$(curl -s "${BASE_URL}/health")
if echo "$HEALTH" | grep -q "healthy"; then
  echo "   ✅ Health check passed"
else
  echo "   ❌ Health check failed: $HEALTH"
  exit 1
fi

# Test 2: Protected endpoint without auth (should fail)
echo "2️⃣ Testing auth protection..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/reports/cis/TEST-001")
if [ "$STATUS" -eq 401 ]; then
  echo "   ✅ Auth protection working (401 returned)"
else
  echo "   ❌ Expected 401, got: $STATUS"
  exit 1
fi

# Test 3: Protected endpoint with valid token
echo "3️⃣ Testing authenticated CIS report..."
if [ -z "$TEST_TOKEN" ]; then
  echo "   ⚠️ Skipped (set FIREBASE_ID_TOKEN to test)"
else
  REPORT=$(curl -s -H "Authorization: Bearer ${TEST_TOKEN}" \
    "${BASE_URL}/api/reports/cis/TEST-001")
  
  if echo "$REPORT" | grep -q "success"; then
    echo "   ✅ Authenticated request succeeded"
  else
    echo "   ❌ Authenticated request failed: $REPORT"
    exit 1
  fi
fi

# Test 4: CORS headers
echo "4️⃣ Testing CORS..."
CORS=$(curl -s -I -X OPTIONS \
  -H "Origin: https://verify.rprcomms.com" \
  -H "Access-Control-Request-Method: GET" \
  "${BASE_URL}/health")

if echo "$CORS" | grep -q "access-control-allow-origin"; then
  echo "   ✅ CORS headers present"
else
  echo "   ❌ CORS headers missing"
  exit 1
fi

# Test 5: Escalation endpoints
echo "5️⃣ Testing escalation endpoints..."
if [ -z "$TEST_TOKEN" ]; then
  echo "   ⚠️ Skipped (set FIREBASE_ID_TOKEN to test)"
else
  ESC_LIST=$(curl -s -H "Authorization: Bearer ${TEST_TOKEN}" \
    "${BASE_URL}/api/escalation/list")
  
  if echo "$ESC_LIST" | grep -q "success"; then
    echo "   ✅ Escalation list endpoint working"
  else
    echo "   ❌ Escalation list failed: $ESC_LIST"
    exit 1
  fi
fi

echo ""
echo "✅ All smoke tests passed!"
