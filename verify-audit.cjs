const admin = require('firebase-admin');

// Authenticate via local gcloud session
// Target: rpr-verify-b Firestore project
admin.initializeApp({
    projectId: 'rpr-verify-b'
});

const db = admin.firestore();

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
    } finally {
        process.exit();
    }
}

runAudit();
