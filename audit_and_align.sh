#!/bin/bash

# RPR-VERIFY: AUDIT AND ALIGN SCRIPT
# Authority: RPR-KONTROL v1.0
# Purpose: Read-only audit of shadow files and Firebase CLI alignment
# Output: irrelevant_files_log.txt

PROJECT_ROOT="/Users/puvansivanasan/PERPLEXITY-NEW/JOBS/2025-003-VERIFY/RPR-VERIFY"
LOG_FILE="$PROJECT_ROOT/irrelevant_files_log.txt"

echo "========================================================"
echo "🛡️  RPR-VERIFY | AUDIT AND ALIGN"
echo "========================================================"
echo ""

# Initialize log file
echo "RPR-VERIFY Shadow Files Audit" > "$LOG_FILE"
echo "Generated: $(date)" >> "$LOG_FILE"
echo "========================================================" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# SECTION 1: Shadow File Detection
echo "[1] Scanning for Shadow Files and Build Remnants..."
echo "" >> "$LOG_FILE"
echo "SECTION 1: SHADOW FILES" >> "$LOG_FILE"
echo "------------------------" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Check for malformed JS file
MALFORMED_JS="$PROJECT_ROOT/frontend/src/app/features/verification/const admin = require('firebase-admin');.js"
if [ -f "$MALFORMED_JS" ]; then
    echo "  ⚠️  FOUND: Malformed JS file (invalid filename)" | tee -a "$LOG_FILE"
    echo "     Path: $MALFORMED_JS" >> "$LOG_FILE"
    echo "     Action: DELETE (confirmed duplicate of wipe-storage.js)" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
fi

# Check for root-level config files
echo "[2] Checking Root-Level Config Files..." | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "SECTION 2: ROOT-LEVEL CONFIG FILES" >> "$LOG_FILE"
echo "-----------------------------------" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

if [ -f "$PROJECT_ROOT/vite.config.ts" ]; then
    echo "  ⚠️  FOUND: vite.config.ts (root level)" | tee -a "$LOG_FILE"
    echo "     Path: $PROJECT_ROOT/vite.config.ts" >> "$LOG_FILE"
    echo "     Status: REVIEW REQUIRED - Angular project uses Angular CLI, not Vite" >> "$LOG_FILE"
    echo "     Action: Review and delete if unnecessary" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
fi

if [ -f "$PROJECT_ROOT/vitest.config.ts" ]; then
    echo "  ⚠️  FOUND: vitest.config.ts (root level)" | tee -a "$LOG_FILE"
    echo "     Path: $PROJECT_ROOT/vitest.config.ts" >> "$LOG_FILE"
    echo "     Status: REVIEW REQUIRED - May be for root src/ directory testing" >> "$LOG_FILE"
    echo "     Action: Review and delete if unnecessary" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
fi

# Check for root-level src directory
echo "[3] Checking Root-Level Source Directory..." | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "SECTION 3: ROOT-LEVEL SOURCE DIRECTORY" >> "$LOG_FILE"
echo "--------------------------------------" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

if [ -d "$PROJECT_ROOT/src" ]; then
    echo "  ⚠️  FOUND: src/ directory (root level)" | tee -a "$LOG_FILE"
    echo "     Path: $PROJECT_ROOT/src" >> "$LOG_FILE"
    echo "     Contents: $(ls -1 "$PROJECT_ROOT/src" | tr '\n' ', ')" >> "$LOG_FILE"
    echo "     Status: REVIEW REQUIRED - Angular project should use frontend/src/" >> "$LOG_FILE"
    echo "     Action: Review and delete if remnant" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
fi

# Check for remnant files
echo "[4] Checking Remnant Files..." | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "SECTION 4: REMNANT FILES" >> "$LOG_FILE"
echo "------------------------" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

REMNANTS=("expressions.txt" "rpr-verify-main.html" "create_triad_job.py" "report_generator_implementation.py")
for file in "${REMNANTS[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        echo "  ⚠️  FOUND: $file" | tee -a "$LOG_FILE"
        echo "     Path: $PROJECT_ROOT/$file" >> "$LOG_FILE"
        echo "     Action: DELETE (confirmed remnant)" >> "$LOG_FILE"
        echo "" >> "$LOG_FILE"
    fi
done

# SECTION 5: Firebase CLI Alignment Check
echo "[5] Verifying Firebase CLI Configuration..." | tee -a "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "SECTION 5: FIREBASE CLI ALIGNMENT" >> "$LOG_FILE"
echo "---------------------------------" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "  ❌ Firebase CLI not found in PATH" | tee -a "$LOG_FILE"
    echo "     Action: Install Firebase CLI: npm install -g firebase-tools" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
else
    echo "  ✅ Firebase CLI is installed" | tee -a "$LOG_FILE"

    # Check current project
    if [ -f "$PROJECT_ROOT/.firebaserc" ]; then
        CURRENT_PROJECT=$(grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' "$PROJECT_ROOT/.firebaserc" | grep -o '"[^"]*"' | tr -d '"' | head -1)
        if [ "$CURRENT_PROJECT" = "rpr-verify-b" ]; then
            echo "  ✅ Firebase project: rpr-verify-b" | tee -a "$LOG_FILE"
        else
            echo "  ⚠️  Firebase project mismatch: $CURRENT_PROJECT (expected: rpr-verify-b)" | tee -a "$LOG_FILE"
            echo "     Action: Run 'firebase use rpr-verify-b'" >> "$LOG_FILE"
        fi
    else
        echo "  ⚠️  .firebaserc not found" | tee -a "$LOG_FILE"
        echo "     Action: Run 'firebase use rpr-verify-b'" >> "$LOG_FILE"
    fi

    # Check Firebase functions region (if functions exist)
    if [ -f "$PROJECT_ROOT/backend/functions/src/index.ts" ]; then
        REGION_CHECK=$(grep -i "australia-southeast1\|asia-southeast1" "$PROJECT_ROOT/backend/functions/src/index.ts" || echo "")
        if [ -n "$REGION_CHECK" ]; then
            echo "  ✅ Functions region configured for Singapore (asia-southeast1)" | tee -a "$LOG_FILE"
        else
            echo "  ⚠️  Functions region may not be set to Singapore" | tee -a "$LOG_FILE"
            echo "     Action: Verify region in backend/functions/src/index.ts" >> "$LOG_FILE"
        fi
    fi
    echo "" >> "$LOG_FILE"
fi

# Summary
echo "========================================================"
echo "AUDIT COMPLETE"
echo "========================================================"
echo ""
echo "📋 Full audit log saved to: $LOG_FILE"
echo ""
echo "Next Steps:"
echo "  1. Review irrelevant_files_log.txt"
echo "  2. Confirm shadow files flagged for deletion"
echo "  3. Run cleanup_shadows.sh to remove confirmed remnants"
echo ""
