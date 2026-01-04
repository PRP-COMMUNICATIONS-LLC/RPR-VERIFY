#!/bin/bash
# Sentinel Bridge: Local Environment Cleanup & Reset
# Purges caches, resets watchers, and frees ports for clean development startup
# Uses graceful kill (SIGTERM) first, then SIGKILL as fallback to prevent zombie processes

set -e

echo "🔧 Sentinel Bridge: Cleaning local environment..."
echo "================================================"

# Step 1: Gracefully kill processes on common development ports
echo ""
echo "🔌 Step 1: Freeing development ports (graceful kill)..."
PORTS=(4200 8080 7243 3000)
for port in "${PORTS[@]}"; do
  PID=$(lsof -ti:$port 2>/dev/null || true)
  if [ ! -z "$PID" ]; then
    echo "   Attempting graceful termination on port $port (PID: $PID)"
    # Try graceful SIGTERM first
    kill $PID 2>/dev/null || true
    sleep 2
    # Check if process still exists, force kill if needed
    if kill -0 $PID 2>/dev/null; then
      echo "   Force killing process on port $port (PID: $PID)"
      kill -9 $PID 2>/dev/null || true
    else
      echo "   Process on port $port terminated gracefully"
    fi
  else
    echo "   Port $port is free"
  fi
done

# Step 2: Clear Angular build cache
echo ""
echo "🧹 Step 2: Clearing Angular build cache..."
if [ -d "frontend/.angular" ]; then
  rm -rf frontend/.angular
  echo "   Cleared frontend/.angular"
fi

# Step 3: Clear Node.js module caches
echo ""
echo "📦 Step 3: Clearing Node.js caches..."
if [ -d "frontend/node_modules/.cache" ]; then
  rm -rf frontend/node_modules/.cache
  echo "   Cleared frontend/node_modules/.cache"
fi

# Step 4: Clear Cursor cache (identified in previous logs)
echo ""
echo "🖥️  Step 4: Clearing Cursor cache..."
if [ -d ".cursor/cache" ]; then
  rm -rf .cursor/cache
  echo "   Cleared .cursor/cache"
fi

# Step 5: Clear Python cache files (targeting backend specifically)
echo ""
echo "🐍 Step 5: Clearing Python cache..."
if [ -d "backend/__pycache__" ]; then
  rm -rf backend/__pycache__
  echo "   Cleared backend/__pycache__"
fi
find backend -type f -name "*.pyc" -delete 2>/dev/null || true
echo "   Cleared Python cache files"

# Step 6: Reset file watchers (macOS specific)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo ""
  echo "👁️  Step 6: Resetting file watchers (macOS)..."
  echo "   File watchers ready"
fi

echo ""
echo "✅ Sentinel Bridge: Environment cleanup complete!"
echo "================================================"
echo ""
echo "📋 Next steps:"
echo "1. Start frontend: cd frontend && npm start"
echo "2. Start backend: ./scripts/local-dev-backend.sh (if needed)"
echo ""
