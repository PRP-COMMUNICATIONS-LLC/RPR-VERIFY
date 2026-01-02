const axios = require('axios');
const url = 'https://asia-southeast1-rpr-verify-b.cloudfunctions.net/cisReportApi';

async function trigger() {
    console.log('--- RPR-KONTROL: INITIATING TR-01 ANOMALY ---');
    try {
        const res = await axios.post(url, {
            identity: 'FORENSIC_TEST_SVR',
            address: 'SINGAPORE_NODE_ALPHA',
            posture: 'ANOMALY_DETECTION_RUN'
        });
        console.log('Status:', res.status, 'Response:', res.data);
    } catch (e) {
        console.error('Trigger Failed:', e.message);
        if (e.response && e.response.status === 403) {
            console.error('VERDICT: ACCESS FORBIDDEN - IAM POLICY STILL PRIVATE');
        }
    }
}
trigger();
