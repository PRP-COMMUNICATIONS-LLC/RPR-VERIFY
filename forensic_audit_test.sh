#!/bin/bash
# Usage: ./forensic_audit_test.sh path/to/image.jpg
# Authority: RPR-VERIFY Sovereign Constitution v12.4

IMAGE_PATH=$1
CASE_ID="RPR-PROD-2026-TEST"

if [ -z "$IMAGE_PATH" ]; then
    echo "❌ Error: Please provide an image path."
    echo "Usage: ./forensic_audit_test.sh path/to/image.jpg"
    exit 1
fi

# Automate Base64 encoding (macOS/Linux compatible)
if [[ "$OSTYPE" == "darwin"* ]]; then
    B64_DATA=$(base64 -i "$IMAGE_PATH")
else
    B64_DATA=$(base64 -w 0 "$IMAGE_PATH")
fi

echo "📡 Sending Forensic Audit Request for Case: $CASE_ID"

# Corrected Production URL for rpr-verify-b
curl -X POST "https://asia-southeast1-rpr-verify-b.cloudfunctions.net/cisReportApi" \
  -H "Content-Type: application/json" \
  -d "{
    \"case_id\": \"$CASE_ID\",
    \"document_type\": \"POI\",
    \"image_data\": \"$B64_DATA\"
  }"
