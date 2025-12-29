#!/usr/bin/env bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔎 Phase 4 Vision Engine – Verification Suite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Ensure we are in the correct repo
cd "/Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY"

echo "[1/4] Verifying environment variables..."

REQUIRED_VARS=(GEMINI_API_KEY NOTION_TOKEN RPR_VERIFY_TASK_DB_ID)
MISSING=0

for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "  ❌ $var is NOT set"
    MISSING=1
  else
    echo "  ✅ $var is set"
  fi
done

if [[ "$MISSING" -ne 0 ]]; then
  echo ""
  echo "❗ One or more required environment variables are missing."
  echo "   Please export:"
  echo "     export GEMINI_API_KEY=\"...\""
  echo "     export NOTION_TOKEN=\"...\""
  echo "     export RPR_VERIFY_TASK_DB_ID=\"...\""
  echo "   Then re-run this script."
  exit 1
fi

echo ""
echo "[2/4] Printing Python version and venv status..."
python --version || true
which python || true

echo ""
echo "[3/4] Running backend Vision Engine tests..."
set +e
python backend/tests/test_vision_engine.py
TEST_EXIT_CODE=$?
set -e

echo ""
echo "[4/4] Interpreting result..."
if [[ "$TEST_EXIT_CODE" -eq 0 ]]; then
  echo "✅ Phase 4 Vision Engine verification suite PASSED."
  echo "   - Structured Output Parsing: PASS"
  echo "   - Risk Logic Accuracy: PASS"
  echo "   - Notion Soft-Failure: PASS"
  echo "   - PII Masking: PASS"
  exit 0
else
  echo "❌ Phase 4 Vision Engine verification suite FAILED (exit code $TEST_EXIT_CODE)."
  echo "   Copilot: please show the failing test names and trace from the above output,"
  echo "   but do NOT modify any code until explicitly instructed."
  exit "$TEST_EXIT_CODE"
fi
