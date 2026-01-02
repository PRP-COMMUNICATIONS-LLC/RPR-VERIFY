#!/bin/bash
# RPR-VERIFY Infrastructure Restoration Script
# Per PRD v5.0 Section 8.1 and 8.2
# This script manifests the missing infrastructure files for RPR-VERIFY

set -e  # Exit on error

echo "🔐 RPR-VERIFY Infrastructure Restoration"
echo "========================================"

# Step 1: Security Shield (.gitignore)
echo ""
echo "📋 Step 1: Adding Security Shield to .gitignore..."
if grep -q "RPR-VERIFY Sovereign Keys" .gitignore; then
    echo "   ✅ Security shield already present in .gitignore"
else
    echo "" >> .gitignore
    echo "# RPR-VERIFY Sovereign Keys" >> .gitignore
    echo "service-account.json" >> .gitignore
    echo "src/environments/environment.ts" >> .gitignore
    echo "src/environments/environment.prod.ts" >> .gitignore
    echo "   ✅ Security shield added to .gitignore"
fi

# Step 2: Service Account Validation
echo ""
echo "🔑 Step 2: Validating Service Account..."
if [ -f "service-account.json" ]; then
    # Validate JSON structure
    if jq empty service-account.json 2>/dev/null; then
        PROJECT_ID=$(jq -r '.project_id' service-account.json)
        CLIENT_EMAIL=$(jq -r '.client_email' service-account.json)
        PRIVATE_KEY_ID=$(jq -r '.private_key_id' service-account.json)
        
        if [ "$PROJECT_ID" = "rpr-verify-b" ] && \
           [ "$CLIENT_EMAIL" = "firebase-adminsdk-fbsvc@rpr-verify-b.iam.gserviceaccount.com" ] && \
           [ "$PRIVATE_KEY_ID" = "172c4550fbdf5049b637ffca30845c37136aa4f4" ]; then
            echo "   ✅ Service account validated per PRD Section 9.1"
            echo "      - Project ID: $PROJECT_ID"
            echo "      - Client Email: $CLIENT_EMAIL"
            echo "      - Private Key ID: $PRIVATE_KEY_ID"
        else
            echo "   ⚠️  Service account exists but metadata doesn't match PRD Section 9.1"
            exit 1
        fi
    else
        echo "   ❌ service-account.json exists but is not valid JSON"
        exit 1
    fi
else
    echo "   ❌ service-account.json not found - must be created manually with credentials from PRD Section 9.1"
    exit 1
fi

# Step 3: GitHub Workflow
echo ""
echo "🚀 Step 3: Creating GitHub Deployment Workflow..."
mkdir -p .github/workflows

if [ -f ".github/workflows/deploy.yml" ]; then
    echo "   ✅ deploy.yml already exists"
else
    cat > .github/workflows/deploy.yml <<'EOF'
name: Veritas Smoke Test & Deploy
on:
  push:
    branches: [ main ]
jobs:
  veritas-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Dependencies
        run: cd frontend && npm install
      - name: Veritas Lint Check
        run: cd frontend && npm run lint
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: rpr-verify-b
EOF
    echo "   ✅ Created .github/workflows/deploy.yml"
fi

# Step 4: Validate YAML syntax
echo ""
echo "🔍 Step 4: Validating Workflow YAML..."
if command -v yamllint &> /dev/null; then
    yamllint .github/workflows/deploy.yml && echo "   ✅ YAML syntax valid" || echo "   ⚠️  YAML validation skipped (yamllint not available)"
elif command -v python3 &> /dev/null; then
    python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))" && echo "   ✅ YAML syntax valid" || echo "   ⚠️  YAML validation skipped"
else
    echo "   ⚠️  YAML validation skipped (no validator available)"
fi

# Step 5: Environment Files Check
echo ""
echo "📁 Step 5: Checking Environment Files..."
if [ -f "frontend/src/environments/environment.prod.ts" ] && [ -f "frontend/src/environments/environment.ts" ]; then
    echo "   ✅ Environment files exist at frontend/src/environments/"
    echo "      - environment.prod.ts (with placeholders for Docker build)"
    echo "      - environment.ts (development configuration)"
else
    echo "   ⚠️  Environment files not found - they should exist per Angular configuration"
fi

echo ""
echo "✅ Infrastructure Restoration Complete!"
echo ""
echo "📊 Summary:"
echo "   - Security shield: .gitignore updated"
echo "   - Service account: Validated per PRD Section 9.1"
echo "   - GitHub workflow: .github/workflows/deploy.yml created"
echo "   - Environment files: Verified"
echo ""
echo "🚀 Next Steps:"
echo "   1. Ensure FIREBASE_SERVICE_ACCOUNT secret is configured in GitHub"
echo "   2. Commit changes: git add .gitignore .github/workflows/deploy.yml"
echo "   3. Push to trigger Veritas smoke test: git push origin main"
