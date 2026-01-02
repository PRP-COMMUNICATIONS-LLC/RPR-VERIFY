import firebase_admin
from firebase_admin import auth
from functools import wraps
from flask import request, jsonify, Flask
from flask_cors import CORS
from vision_engine import vision_service
import os

if not firebase_admin._apps:
    firebase_admin.initialize_app()

app = Flask(__name__)
CORS(app)

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized: Identity required"}), 401

        id_token = auth_header.split('Bearer ')[1]
        try:
            # Enforce Firebase Token Verification
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # Identity bound to request
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": f"Invalid Token: {str(e)}"}), 403
    return decorated

@app.route('/api/v1/slips/scan', methods=['POST'])
@require_auth
def scan_slip():
    """Scan bank slip with forensic metadata."""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    file_bytes = file.read()
    mime_type = file.content_type
    
    # Extract forensic metadata from FormData
    forensic_metadata = {
        'caseId': request.form.get('caseId', ''),
        'analystId': request.form.get('analystId', ''),
        'documentType': request.form.get('documentType', 'BANK_SLIP'),
        'priority': request.form.get('priority', 'MEDIUM'),
        'reportId': request.form.get('reportId', '')
    }
    
    # Trigger Vision Engine with file + metadata
    result = vision_service.scan_slip(file_bytes, mime_type, forensic_metadata)
    
    # Include metadata in response for audit trail
    result['forensicMetadata'] = forensic_metadata
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
