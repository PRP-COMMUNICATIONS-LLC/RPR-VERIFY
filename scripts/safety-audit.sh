#!/bin/bash
# scripts/safety-audit.sh
# AUTHORITY: RPR-KONTROL v1.0
# PURPOSE: Read-only scan for file structure drift. 
#          Does NOT delete or move files.

echo "========================================================"
echo "🛡️  RPR-VERIFY | REPOSITORY SAFETY AUDIT"
echo "========================================================"

# --- SECTION 1: ROOT LEVEL DRIFT ---
echo ""
echo "[1] Checking Root Directory for Stray Files..."
echo "    (Allowed: README*, package*, angular.json, etc.)"
echo "    (Targets: *.md, *.sh outside of archives)"

# List .md files excluding READMEs and specific docs
find . -maxdepth 1 -type f -name "*.md" ! -name "README*" -exec echo "    ⚠️  Stray Markdown: {}" \;

# List .sh files excluding this script directory if it were in root (it's not, scripts are in scripts/)
find . -maxdepth 1 -type f -name "*.sh" -exec echo "    ⚠️  Stray Script: {}" \;

# --- SECTION 2: ARCHITECTURE DRIFT (src/app) ---
echo ""
echo "[2] Checking src/app Architecture..."
echo "    (Standard: core, features, shared)"

# List folders in src/app that are NOT in the standard list
# We assume 'app' itself is depth 0 relative to find, so we look at depth 1.
# We exclude the parent '.' and the standard folders.
if [ -d "src/app" ]; then
    find src/app -maxdepth 1 -type d \
    ! -name "app" \
    ! -name "core" \
    ! -name "features" \
    ! -name "shared" \
    ! -name "layout" \
    -exec echo "    ❓ Non-Standard Folder: {}" \;
else
    echo "    ❌ Error: src/app directory not found."
fi

echo ""
echo "========================================================"
echo "AUDIT COMPLETE."
echo "If items were flagged:"
echo "  1. Run 'scripts/safe-cleanup.sh' to archive root files."
echo "  2. Manually review non-standard app folders."
echo "========================================================"
