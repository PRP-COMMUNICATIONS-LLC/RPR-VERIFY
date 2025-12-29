#!/bin/bash
# scripts/safe-cleanup.sh
# AUTHORITY: RPR-KONTROL v1.0
# PURPOSE: Archive root clutter. 
# WARNING: Review output of 'scripts/safety-audit.sh' first.

# --- SAFETY CHECKS ---
# Uncomment the line below to enable deletions (DANGEROUS)
# ENABLE_DELETION=false

echo "========================================================"
echo "🧹 RPR-VERIFY | SAFE CLEANUP PROTOCOL"
echo "========================================================"

# Ensure archive directories exist
mkdir -p archived_logs
mkdir -p OLD-SCRIPTS

# --- MOVE MARKDOWN FILES ---
echo "[1] Archiving root Markdown files (excluding README)..."
find . -maxdepth 1 -type f -name "*.md" ! -name "README*" -exec mv -v {} archived_logs/ \;

# --- MOVE SHELL SCRIPTS ---
echo "[2] Archiving root Shell scripts..."
find . -maxdepth 1 -type f -name "*.sh" -exec mv -v {} OLD-SCRIPTS/ \;

# --- DESTRUCTIVE CLEANUP (DISABLED BY DEFAULT) ---
# Instructions: Uncomment these lines only if you need to purge specific legacy folders.
# Always run 'scripts/safety-audit.sh' to see what would be targeted.

# echo "[3] Purging Legacy Components..."
# if [ "$ENABLE_DELETION" = "true" ]; then
#     # EXAMPLE: rm -rf src/app/components/
#     # rm -rf src/app/legacy-folder/
#     echo "    (No deletion targets active)"
# else
#     echo "    ⚠️  Deletion Logic Skipped (Safety Lock Active)"
#     echo "    To enable: Edit this script and set logic manually."
# fi

echo "========================================================"
echo "CLEANUP COMPLETE."
echo "========================================================"
