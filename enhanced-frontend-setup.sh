#!/bin/bash
# RPR-VERIFY Complete Frontend Setup v2.0
# Automates Phase 1-2 implementation

set -e  # Exit on error

echo "🚀 RPR-VERIFY Frontend Setup Starting..."

# Navigate to project root
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

# 1. Install All Dependencies
echo "📦 Installing dependencies..."
npm install @angular/material @angular/cdk @angular/material-moment-adapter --save
npm install ng2-charts chart.js date-fns --save
npm install @angular/animations --save

# 2. Create Complete Directory Structure
echo "📁 Creating directory structure..."
mkdir -p src/app/shared/components/{kpi-card,empty-state,loading-skeleton,status-badge,data-table,filter-panel,confirmation-dialog}
mkdir -p src/app/shared/services
mkdir -p src/app/shared/models
mkdir -p src/app/shared/pipes
mkdir -p src/app/shared/directives

echo "✅ Frontend foundation complete!"
echo "📊 Next: Run 'npm run build' to verify setup"