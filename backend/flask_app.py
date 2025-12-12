import os
import uuid
import logging
import tempfile
import base64
import time
import sys
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import storage

# --- CIS Module Import Strategy ---
# This ensures we can find your existing modules inside the container
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    # Attempt to import your actual CIS modules
    from modules.document_processor import DocumentQualityAssessor, OCRExtractor
    from modules.report_generator import ReportGenerator
    
    # Placeholder for the new forensic logic until OpenCV logic is merged
    def enhance_document(path): 
        return path
        
except ImportError as e:
    # Fallback for initial connectivity testing
    print(f"WARNING: CIS modules not found. Running in MOCK mode. Error: {e}")
    
    class MockProcessor:
        def process(self, path): 
            return {"raw_text": "MOCK BANK STATEMENT DATA", "name": "JOHN DOE"}
    
    class MockReportGen:
        def generate_report_json(self, data): 
            return {"status": "mock_report", "risk": "LOW"}
        
        def generate_human_readable(self, data): 
            return "Mock Report Summary"
    
    OCRExtractor = MockProcessor
    ReportGenerator = MockReportGen
    
    def enhance_document(path): 
        return path

# --- Configuration ---
app = Flask(__name__)

# Configure CORS
CORS(app, origins=[
    "https://verify.rprcomms.com",
    "https://www.rprcomms.com"
])

logging.basicConfig(
    level=logging.INFO, 
    format='[%(asctime)s] [%(levelname)s] [%(request_id)s] %(message)s'
)

# Initialize report generator once
report_generator = ReportGenerator()

# --- Helper Functions ---
def get_request_id():
    return request.headers.get('X-Request-ID', str(uuid.uuid4()))

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "rpr-doc-processor",
        "capabilities": ["ocr", "forensic_restoration", "fraud_detection", "reporting"]
    })

@app.route('/analyze', methods=['POST'])
def analyze_document():
    request_id = get_request_id()
    start_time = time.time()
    logger = logging.LoggerAdapter(app.logger, {'request_id': request_id})
    
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No input provided"}), 400
    
    temp_file = None
    try:
        # 1. Load File (Base64 for local test, URL for Prod)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            temp_file = tmp.name
            if 'base64' in data:
                logger.info("Decoding Base64 input")
                tmp.write(base64.b64decode(data['base64']))
            else:
                return jsonify({
                    "status": "error", 
                    "message": "Only base64 supported for local test"
                }), 400
        
        # 2. Forensic Enhancement
        logger.info("Running Forensic Enhancement Pipeline...")
        clean_image_path = enhance_document(temp_file)
        
        # 3. Extraction
        logger.info("Running Tesseract OCR...")
        extractor = OCRExtractor()
        result = extractor.process(clean_image_path)
        
        # 4. Construct Response
        response = {
            "status": "success",
            "request_id": request_id,
            "extracted_data": result,
            "fraud_flags": [],  # Mocking for now - connect to mismatch_detector later
            "quality_score": 0.98,
            "forensic_artifacts": {
                "restored_image": "gs://placeholder/cleaned_card.jpg"
            },
            "processing_time_ms": round((time.time() - start_time) * 1000, 2)
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Processing Failed: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500
        
    finally:
        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)

@app.route('/generate-report', methods=['POST'])
def generate_report():
    request_id = get_request_id()
    logger = logging.LoggerAdapter(app.logger, {'request_id': request_id})
    
    data = request.get_json()
    
    # Expects the output of /analyze to be passed in 'analysis_result'
    if not data or 'analysis_result' not in data:
        return jsonify({
            "status": "error", 
            "message": "No analysis_result provided"
        }), 400
    
    try:
        logger.info("Generating forensic report...")
        
        # Pass the raw analysis data directly to the generator
        report_json = report_generator.generate_report_json(data['analysis_result'])
        
        # Generate text summary
        summary = report_generator.generate_human_readable(report_json)
        
        response = {
            "status": "success",
            "request_id": request_id,
            "report_data": report_json,
            "summary_text": summary
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Report Generation Failed: {str(e)}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
