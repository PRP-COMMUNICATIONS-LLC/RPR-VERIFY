import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from auth_middleware import require_rpr_admin
# LAZY INITIALIZATION: All heavy imports moved inside routes to prevent boot-time OOM

# Configure Forensic Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Grid Consistency: Aligning CORS with your specific domain mandate
CORS(app, resources={r"/*": {"origins": ["https://verify.rprcomms.com", "http://localhost:4200"]}})

# LAZY FIREBASE INITIALIZATION: Only initialize when needed
_firebase_initialized = False

def ensure_firebase_app():
    """Lazy Firebase initialization to prevent boot-time OOM"""
    global _firebase_initialized
    if not _firebase_initialized:
        try:
            firebase_admin.get_app()
        except ValueError:
            # Uses application default credentials on Cloud Run
            firebase_admin.initialize_app()
        _firebase_initialized = True

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        "status": "online",
        "service": "Jules Forensic Orchestrator",
        "version": "1.0.0",
        "region": "Singapore"
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    # Lightweight health check - no Firebase needed
    return jsonify({"status": "peacetime", "color": "#00E0FF"}), 200

@app.route('/api/reports/verification', methods=['POST'])
@require_rpr_admin
def generate_verification_report():
    """
    Forensic PDF Engine: Stitches extracted data into a signed dossier.
    LAZY INITIALIZATION: All heavy components initialized only on request to prevent boot-time OOM.
    """
    try:
        # Ensure Firebase is initialized (lazy)
        ensure_firebase_app()
        
        # LAZY INITIALIZATION: Only instantiate when request arrives (prevents worker boot OOM)
        from cis_generator import CISReportGenerator
        report_gen = CISReportGenerator()
        
        data = request.json
        report_id = data.get('reportId')
        report_type = data.get('reportType', 'VERIFIED') # Matches Branding Dual-State
        admin_email = request.rpr_admin_email

        if not report_id:
            return jsonify({"error": "Missing ID Genesis event"}), 400

        result = report_gen.generate_cis_html(report_id, report_type, admin_email)
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Failing to maintain data gravity: {str(e)}")
        return jsonify({"error": "Forensic Engine Failure", "details": str(e)}), 500

if __name__ == '__main__':
    # Cloud Run dynamic port binding
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
