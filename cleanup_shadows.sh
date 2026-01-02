#!/bin/bash

# RPR-VERIFY: SHADOW FILE REMOVAL SCRIPT
# Authority: Founder (puvansivanasan)
# Action: Physical Deletion of Confirmed Build Remnants

PROJECT_ROOT="/Users/puvansivanasan/PERPLEXITY-NEW/JOBS/2025-003-VERIFY/RPR-VERIFY"

echo "---------------------------------------------------"
echo "STARTING SOVEREIGN CLEANUP"
echo "---------------------------------------------------"

# 1. Delete Malformed File (Confirmed Duplicate)
MALFORMED_JS="$PROJECT_ROOT/frontend/src/app/features/verification/const admin = require('firebase-admin');.js"
if [ -f "$MALFORMED_JS" ]; then
    echo "[DELETE] Removing malformed JS artifact..."
    rm "$MALFORMED_JS"
    echo "  ✅ Deleted: $MALFORMED_JS"
else
    echo "[SKIP] Malformed JS artifact not found."
fi

# 2. Deleting Shadow Python/HTML remnants (If confirmed)
REMNANTS=("expressions.txt" "rpr-verify-main.html" "create_triad_job.py" "report_generator_implementation.py")
for file in "${REMNANTS[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        echo "[DELETE] Removing remnant: $file"
        rm "$PROJECT_ROOT/$file"
        echo "  ✅ Deleted: $PROJECT_ROOT/$file"
    else
        echo "[SKIP] Remnant not found: $file"
    fi
done

# NOTE: The root src/ and vite configs are flagged for REVIEW in the log.
# Do not delete them via script until manual confirmation is logged.

echo "---------------------------------------------------"
echo "CLEANUP COMPLETE. WORKSPACE HARDENED."
echo "---------------------------------------------------"
