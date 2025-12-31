
const admin = require('firebase-admin');
const path = require('path');

// Ensure service-account.json is in the project root
const serviceAccount = require(path.join(__dirname, 'service-account.json'));


const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// Target the specific named database using settings
const db = admin.firestore();
db.settings({ databaseId: 'rpr-verify-b' });

// List of buckets found via gsutil ls
const targetBuckets = [
  'rpr-verify-documents-verify',
  'rpr-verify-b-reports'
];

async function sovereignWipe() {
  console.log('🛡️ Starting Multi-Bucket Sovereign Wipe...');

  // 1. Wipe Storage Buckets
  for (const bucketName of targetBuckets) {
    try {
      console.log(`🗑️ Clearing Bucket: ${bucketName}...`);
      await admin.storage().bucket(bucketName).deleteFiles();
      console.log(`✅ ${bucketName} is now empty.`);
    } catch (error) {
      console.error(`⚠️ Error with ${bucketName}:`, error.message);
    }
  }

  // 2. Wipe Firestore
  try {
    console.log('🗑️ Clearing Firestore (rpr-verify-b)...');
    const collections = await db.listCollections();
    for (const col of collections) {
      await db.recursiveDelete(col);
      console.log(`- Deleted collection: ${col.id}`);
    }
    console.log('✅ Firestore (rpr-verify-b) is now empty.');
  } catch (error) {
    console.error('❌ Firestore Error:', error.message);
  }
}

sovereignWipe();
