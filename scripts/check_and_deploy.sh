#!/bin/bash
# Phase 4 Deployment Orchestrator
# Sovereign Alignment: asia-southeast1 (Singapore Node)

set -e

echo "🔍 [1/4] Checking Git Alignment..."
git fetch origin
git status

echo "🛠️ [2/4] Cleaning and Rebuilding Backend Functions..."
cd backend/functions
# Atomic Purge of local build
rm -rf lib/
npm install
npm run build

echo "🚀 [3/4] Deploying to Singapore Node (asia-southeast1)..."
# Explicitly use the production project
firebase use rpr-verify-b
firebase deploy --only functions:cisReportApi

echo "✅ [4/4] Phase 4 Backend Ready."
echo "Singapore Endpoint: https://asia-southeast1-rpr-verify-b.cloudfunctions.net/cisReportApi"
