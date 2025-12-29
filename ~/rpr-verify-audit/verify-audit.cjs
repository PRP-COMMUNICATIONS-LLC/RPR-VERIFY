const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

// Service account JSON file path
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'rpr-verify-b-firebase-adminsdk.json');

// Validate service account file exists
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('🔴 ERROR: Service account file not found:', SERVICE_ACCOUNT_PATH);
    console.error('👉 Please place rpr-verify-b-firebase-adminsdk.json in the same directory.');
    process.exit(1);
}

// Initialize Firebase Admin with service account
try {
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    
    // Validate required fields
    if (!serviceAccount.type || serviceAccount.type !== 'service_account') {
        throw new Error('Invalid service account: "type" must be "service_account"');
    }
    if (!serviceAccount.project_id || serviceAccount.project_id !== 'rpr-verify-b') {
        throw new Error('Invalid service account: "project_id" must be "rpr-verify-b"');
    }
    if (!serviceAccount.private_key || !serviceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
        throw new Error('Invalid service account: "private_key" is missing or malformed');
    }
    if (!serviceAccount.client_email) {
        throw new Error('Invalid service account: "client_email" is missing');
    }
    
    initializeApp({
        credential: cert(serviceAccount),
        projectId: 'rpr-verify-b'
    });
    
    console.log('✅ Firebase Admin initialized with service account');
    console.log('📋 Service Account:', serviceAccount.client_email);
} catch (err) {
    console.error('🔴 Initialization Error:', err.message);
    if (err.code === 'MODULE_NOT_FOUND') {
        console.error('👉 Verify the service account JSON file exists and is valid JSON.');
    } else if (err.message.includes('private_key')) {
        console.error('👉 Verify the private_key field contains proper newline characters (\\n).');
    } else {
        console.error('👉 Verify the service account JSON structure matches the required format.');
    }
    process.exit(1);
}

// Get Firestore instance
const db = getFirestore();

async function runAudit() {
    // Target collection: escalations (where backend writes report data)
    console.log('📡 Jules: Scanning "escalations" collection...');
    try {
        // Attempt to get the latest report
        let snapshot = await db.collection('escalations')
            .orderBy('cisGeneratedAt', 'desc')
            .limit(1)
            .get()
            .catch(async (err) => {
                console.log('⚠️ Index not ready, performing raw fetch...');
                return await db.collection('escalations').limit(1).get();
            });

        if (snapshot.empty) {
            console.log('⚪ Grid Status: Clean. No reports found in "escalations".');
            console.log('👉 Action: Open https://verify.rprcomms.com and trigger a report.');
            return;
        }

        snapshot.forEach(doc => {
            console.log('🟢 FORENSIC MATCH FOUND');
            console.log('Report ID:', doc.id);
            console.log('Data:', JSON.stringify(doc.data(), null, 2));
        });
    } catch (err) {
        console.error('🔴 Connection Failure:', err.message);
        if (err.code === 7) {
            console.error('👉 Permission denied. Verify the service account has Firestore access.');
        } else if (err.code === 8) {
            console.error('👉 Resource exhausted. Check Firestore quotas.');
        } else {
            console.error('Stack:', err.stack);
        }
    } finally {
        process.exit();
    }
}

runAudit();
