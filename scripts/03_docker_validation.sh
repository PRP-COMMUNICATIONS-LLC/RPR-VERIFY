#!/bin/bash
# File: scripts/03_docker_validation.sh
# Description: Update Dockerfile and build locally

set -e

echo "🐳 PHASE 3: Docker Validation"
echo "=============================="

cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY/backend

echo "📝 Step 3.1: Update Dockerfile with Chromium dependencies"
cat > Dockerfile << 'EOF'
FROM python:3.11-slim

# Install Chromium system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright Chromium browser
RUN playwright install chromium

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Run Flask app
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--timeout", "300", "--workers", "2", "flask_app:app"]
EOF

echo "🔨 Step 3.2: Build Docker image locally"
docker build -t rpr-verify-pdf:test .

echo "✅ Step 3.3: Verify image built successfully"
docker images | grep rpr-verify-pdf

echo "🧪 Step 3.4: Test Docker container locally"
docker run -d -p 8080:8080 --name rpr-verify-test rpr-verify-pdf:test

echo "⏳ Step 3.5: Wait 10 seconds for container startup"
sleep 10

echo "✅ Step 3.6: Test health endpoint in container"
curl http://localhost:8080/health

echo "📥 Step 3.7: Test PDF generation in container"
curl -o docker_test.pdf "http://localhost:8080/api/reports/cis/TEST-CASE-001?format=pdf"
file docker_test.pdf

echo "🛑 Step 3.8: Stop and remove test container"
docker stop rpr-verify-test
docker rm rpr-verify-test

echo "✅ PHASE 3 COMPLETE: Docker validation successful"
echo ""
echo "Next: Run scripts/04_frontend_implementation.sh"
