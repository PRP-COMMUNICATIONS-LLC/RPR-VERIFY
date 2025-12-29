#!/bin/bash
# File: scripts/08_frontend_deploy.sh
# Description: Deploy Angular frontend

set -e

echo "🌐 PHASE 8: Frontend Deployment"
echo "================================"

cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

echo "📝 Step 8.1: Update production environment"
cat > src/environments/environment.prod.ts << 'EOF'
export const environment = {
  production: true,
  apiUrl: 'https://rpr-verify-794095666194.asia-southeast1.run.app',
  firebase: {
    apiKey: "AIzaSyAcVS96uBW7BW8tw8jeZVV556VqIz1MWKc",
    authDomain: "rpr-verify-b.firebaseapp.com",
    projectId: "rpr-verify-b",
    storageBucket: "rpr-verify-b.firebasestorage.app",
    messagingSenderId: "794095666194",
    appId: "1:794095666194:web:53d30da820b709635844cb"
  },
  googleDrive: {
    clientId: "794095666194-av4h9j5798m3vjlj3amo7csjir2uig7i.apps.googleusercontent.com",
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.appdata'
    ]
  }
};
EOF

echo "🔨 Step 8.2: Build production Angular app"
ng build --configuration production

echo "🚀 Step 8.3: Deploy to Firebase Hosting"
firebase deploy --only hosting

echo "✅ PHASE 8 COMPLETE: Frontend deployed"
echo ""
echo "🎉 MIGRATION COMPLETE!"
echo "Test at: https://rpr-verify.web.app"
