#!/bin/bash
# Description: Automates updating the last deployment date and time in the status report.

REPORT_FILE="DEPLOYMENT-SUMMARY.md" # <-- TARGET FILE MODIFIED

# 1. Get the current date and time in the required format
NEW_DATE=$(date +"%B %d, %Y, %r") # Example: December 14, 2025, 05:43:00 AM
NEW_DATE_SHORT=$(date +"%b %d, %Y, %r") # For the 'Report Prepared' footer

# 2. Update the main Date in the file (using sed for in-place replacement)
# FIXED: Escaped asterisks for regex
sed -i '' "s|^\*\*Date:\*\* .*|**Date:** ${NEW_DATE} +08|" "$REPORT_FILE"

# 3. Update the Footer Date
# Target line: ***Report Prepared:*** Dec 14, 2025, 5:42 AM +08
sed -i '' "s|^\*\*\*Report Prepared:\*\*\* .*|\*\*\*Report Prepared:\*\*\* ${NEW_DATE_SHORT} +08|" "$REPORT_FILE"


# 4. Update the Deployment Status
# Target line: Final build deployed (Dec 13)
sed -i '' "s|Final build deployed (.*)|Final build deployed ($(date +%b\ %d))|" "$REPORT_FILE"


echo "✅ Status report updated successfully with current deployment date: $NEW_DATE"
