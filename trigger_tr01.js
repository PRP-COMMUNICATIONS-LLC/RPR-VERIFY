const axios = require('axios');

const BACKEND_URL = 'https://asia-southeast1-rpr-verify-b.cloudfunctions.net/api/reports/verification';
const CASE_ID = 'SMOKE-TEST-SG-' + Date.now();

async function runSovereignHealthCheck() {
  console.log(`🚀 Initiating Sovereign Health Check...`);
  console.log(`📍 Target Node: ${BACKEND_URL}`);
  console.log(`🔑 Case ID: ${CASE_ID}`);

  try {
    // We send an empty request to check for connectivity and auth status
    const response = await axios.post(BACKEND_URL, {
      case_id: CASE_ID,
      document_image: "HEALTH_CHECK_ONLY"
    });

    console.log('✅ Node Reachable.');
    console.log('📊 Response Status:', response.status);
    console.log('✅ VERDICT: Backend API responding from asia-southeast1');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ Node Reachable (Authenticated/Private).');
      console.log('🔒 Security Policy: Enforced.');
      console.log('✅ VERDICT: Backend API responding from asia-southeast1 - Auth required (expected)');
    } else if (error.response && error.response.status === 401) {
      console.log('✅ Node Reachable (Auth Required).');
      console.log('✅ VERDICT: Backend API responding from asia-southeast1 - Authentication enforced');
    } else if (error.response && error.response.status < 500) {
      // Any 4xx status means the node is reachable and responding
      console.log(`✅ Node Reachable (Status: ${error.response.status}).`);
      console.log('✅ VERDICT: Backend API responding from asia-southeast1');
    } else {
      console.error('❌ Connectivity Failure:', error.message);
      if (error.response) {
        console.error('❌ Response Status:', error.response.status);
        console.error('❌ Response Data:', error.response.data);
      }
      process.exit(1);
    }
  }
}

runSovereignHealthCheck();
