#!/bin/bash

# Safe git clean script with preview and confirmation
# This script previews what git clean would remove, then asks for confirmation before proceeding.

set -e  # Exit on any error

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository."
    exit 1
fi

echo "=== Git Clean Preview ==="
echo "The following untracked files and directories would be removed:"
echo ""

# Preview what would be cleaned (files and directories)
git clean --dry-run -d

echo ""
echo "=== Confirmation ==="
read -p "Do you want to proceed with git clean? This will permanently delete the above files/directories. (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Proceeding with git clean..."
    git clean -d -f
    echo "Git clean completed successfully."
else
    echo "Git clean cancelled. No files were removed."
fi