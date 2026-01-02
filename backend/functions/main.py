from flask import Flask, request, jsonify
from flask_cors import CORS
from vision_engine import vision_service
from sentinel_logic import evaluate_forensic_triggers
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for smoke tests."""
    return jsonify({"status": "healthy"}), 200

@app.route('/api/v1/slips/scan', methods=['POST'])
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

@app.route('/api/v1/sentinel/evaluate', methods=['POST'])
def evaluate_sentinel():
    """Evaluates forensic triggers using the Sentinel Engine."""
    data = request.get_json()
    if not data or 'bundle_metadata' not in data or 'timeline_events' not in data:
        return jsonify({"error": "Missing bundle_metadata or timeline_events"}), 400

    bundle_metadata = data['bundle_metadata']
    timeline_events = data['timeline_events']

    fired_triggers = evaluate_forensic_triggers(bundle_metadata, timeline_events)

    return jsonify({
        "status": "success",
        "fired_triggers": fired_triggers
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))
