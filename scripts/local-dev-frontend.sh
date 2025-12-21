#!/bin/bash

# RPR-VERIFY Frontend Local Dev Launcher
# Usage: ./scripts/local-dev-frontend.sh
# Working Directory: /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

echo "🚀 Starting RPR-VERIFY Frontend (Local)..."

# Check for Node modules
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node dependencies..."
    npm install
fi

# Start Angular Serve
echo "✅ Frontend running at http://localhost:4200"
npm start

