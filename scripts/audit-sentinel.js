const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Explicit Target

async function runAudit() {
  console.log('--- RPR-VERIFY FORENSIC AUDIT ---');
  const snapshot = await db.collection('customer_intake').get();
  if (snapshot.empty) {
    console.log('Status: TABULA RASA (Clean Slate)');
    return;
  }
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`Record [${doc.id}]: Posture=${data.audit_metadata?.posture || 'MISSING'}`);
  });
}
runAudit();
