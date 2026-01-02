const admin = require('firebase-admin');
const path = require('path');

// Ensure the service-account.json is in the same folder as this script
const serviceAccount = require(path.join(__dirname, 'service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'rpr-verify-b.firebasestorage.app'
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

async function sovereignWipe() {
  console.log('🛡️ Starting Sovereign Wipe...');
  // 1. Wipe Storage
  try {
    console.log('🗑️ Clearing Storage Bucket...');
    await bucket.deleteFiles();
    console.log('✅ Storage is now empty.');
  } catch (error) {
    console.error('❌ Storage Error:', error.message);
  }
  // 2. Wipe Firestore
  try {
    console.log('🗑️ Clearing Firestore Database...');
    const collections = await db.listCollections();
    if (collections.length === 0) {
      console.log('ℹ️ No collections found to delete.');
    }
    for (const col of collections) {
      await db.recursiveDelete(col);
      console.log(`- Deleted collection: ${col.id}`);
    }
    console.log('✅ Firestore is now empty.');
  } catch (error) {
    console.error('❌ Firestore Error:', error.message);
  }
}

sovereignWipe();