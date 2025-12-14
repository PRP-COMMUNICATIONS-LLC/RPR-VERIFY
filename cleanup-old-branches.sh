#!/bin/bash
# cleanup-old-branches.sh
# Deletes remote branches older than 30 days, excluding main/master/develop

# Fetch latest refs
git fetch --prune

# Get current date in seconds
CURRENT_TIME=$(date +%s)

# Loop through remote branches
git for-each-ref --format='%(committerdate:unix) %(refname:short)' refs/remotes/origin/ | while read -r DATE BRANCH; do
    # Skip main, master, HEAD
    if [[ "$BRANCH" =~ "origin/main" ]] || [[ "$BRANCH" =~ "origin/master" ]] || [[ "$BRANCH" =~ "origin/HEAD" ]]; then
        continue
    fi
    
    # Check age (30 days = 2592000 seconds)
    AGE=$((CURRENT_TIME - DATE))
    if [ $AGE -gt 2592000 ]; then
        # Strip 'origin/' prefix for pushing delete
        BRANCH_NAME=${BRANCH#origin/}
        echo "Deleting stale branch: $BRANCH_NAME (Last commit: $(date -r $DATE))"
        git push origin --delete "$BRANCH_NAME"
    fi
done

echo "Branch cleanup complete."
