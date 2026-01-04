import os
import sys
import logging
from functools import lru_cache
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from auth_middleware import require_rpr_admin
# LAZY INITIALIZATION: All heavy imports moved inside routes to prevent boot-time OOM

# Configure Forensic Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# CORS Configuration: Support preflight OPTIONS requests and multiple origins
# Read allowed origins from environment variable or use defaults
allowed_origins_env = os.environ.get('ALLOWED_ORIGINS', '')
if allowed_origins_env:
    # Parse comma-separated origins from environment variable
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(',')]
else:
    # Default origins for local dev and production
    allowed_origins = [
        'http://localhost:4200',
        'https://verify.rprcomms.com',
        'https://www.rprcomms.com',
        'https://rpr-verify-b.web.app',
        'https://rpr-verify.web.app'
    ]

# Configure CORS with explicit options for preflight handling
CORS(app, 
     resources={r"/*": {
         "origins": allowed_origins,
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "X-Request-ID"],
         "expose_headers": ["Content-Type"],
         "supports_credentials": True,
         "max_age": 3600  # Cache preflight for 1 hour
     }})

# Hybrid Authorization: OPAL sidecar with LRU cache for performance
@lru_cache(maxsize=128)
def get_opal_decision(origin: str, sidecar_url: str):
    """
    Cached OPAL sidecar authorization check.
    Returns True if allowed, False if denied, None if check failed (fallback).
    """
    try:
        import requests
        resp = requests.get(
            f"{sidecar_url}/v1/data/rpr/allow_origin",
            params={"origin": origin},
            timeout=0.5  # Reduced timeout to prevent blocking
        )
        if resp.status_code == 200:
            result = resp.json().get('result', False)
            return result
        return False
    except Exception as e:
        logger.warning(f"[HYBRID AUTH] OPAL check failed: {str(e)}")
        return None  # Signal fallback to environment variables

@app.before_request
def hybrid_authorization():
    """
    Hybrid Authorization: OPAL sidecar first (with LRU cache), environment fallback second.
    Prepares for Phase 4 Sentinel (OPAL) integration while maintaining current functionality.
    """
    # Skip authorization for OPTIONS preflight (handled by Flask-CORS)
    if request.method == 'OPTIONS':
        return None
    
    origin = request.headers.get('Origin', '')
    opal_enabled = os.environ.get('OPAL_ENABLED', 'false').lower() == 'true'
    
    if opal_enabled:
        # Phase 4: Delegate to OPAL sidecar (with caching to prevent blocking)
        opal_sidecar_url = os.environ.get('OPAL_SIDECAR_URL', 'http://localhost:8181')
        decision = get_opal_decision(origin, opal_sidecar_url)
        
        if decision is True:
            logger.info(f"[HYBRID AUTH] OPAL allowed origin: {origin}")
            # Extract and log Project ID from headers for security context
            project_id = request.headers.get('X-Project-ID')
            if project_id:
                logger.info(f"[HYBRID AUTH] Request with Project ID: {project_id}")
            return None  # Allow request
        elif decision is False:
            logger.warning(f"[HYBRID AUTH] OPAL denied origin: {origin}")
            return jsonify({"error": "Forbidden by Sentinel"}), 403
        # If decision is None, fall through to environment variable check
    
    # Fallback: Use environment variable-based authorization
    if origin and origin not in allowed_origins:
        logger.warning(f"[HYBRID AUTH] Environment denied origin: {origin}")
        return jsonify({"error": "Origin not authorized"}), 403
    
    # Extract and log Project ID from headers for security context
    project_id = request.headers.get('X-Project-ID')
    if project_id:
        logger.info(f"[HYBRID AUTH] Request with Project ID: {project_id}")
    
    return None  # Allow request

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

@app.route('/extractIdentity', methods=['POST', 'OPTIONS'])
def extract_identity():
    """
    Zero-Touch Identity Extraction Endpoint
    Extracts firstName, lastName, and idNumber from document images using Gemini Vision.
    Flask-CORS automatically handles OPTIONS preflight requests.
    """
    try:
        # If this is an OPTIONS preflight, Flask-CORS handles it automatically
        if request.method == 'OPTIONS':
            return '', 200
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing request body"}), 400
        
        image_base64 = data.get('image', '').strip()
        if not image_base64:
            return jsonify({"error": "Missing 'image' field in request body"}), 400
        
        # Strip data URI prefix if present (e.g., "data:image/jpeg;base64,")
        if ',' in image_base64:
            image_base64 = image_base64.split(',', 1)[1]
        
        # Ensure functions directory is in Python path for Cloud Run container
        current_dir = os.path.dirname(os.path.abspath(__file__))
        functions_dir = os.path.join(current_dir, 'functions')
        if functions_dir not in sys.path:
            sys.path.insert(0, functions_dir)
        
        # Import vision engine (lazy import to prevent boot-time issues)
        try:
            from functions.vision_engine import extract_identity as vision_extract_identity, DocumentParseError, RateLimitError
        except ImportError:
            # Fallback: try direct import if functions is not a package
            import vision_engine
            vision_extract_identity = vision_engine.extract_identity
            DocumentParseError = vision_engine.DocumentParseError
            RateLimitError = vision_engine.RateLimitError
        
        # Decode base64 image
        import base64
        try:
            image_bytes = base64.b64decode(image_base64)
        except Exception as e:
            return jsonify({"error": f"Invalid base64 image data: {str(e)}"}), 400
        
        # Extract identity using vision engine
        try:
            identity_result = vision_extract_identity(image_bytes)
        except RateLimitError:
            return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429
        except DocumentParseError as e:
            return jsonify({"error": f"Failed to extract identity from document: {str(e)}"}), 400
        
        # First-word split logic: first word = firstName, rest = lastName
        full_name = identity_result.get('name', '').strip()
        name_parts = full_name.split()
        
        if len(name_parts) == 0:
            firstName = ''
            lastName = ''
        elif len(name_parts) == 1:
            firstName = ''
            lastName = name_parts[0]
        else:
            firstName = name_parts[0]
            lastName = ' '.join(name_parts[1:])
        
        id_number = identity_result.get('id', '').strip()
        
        return jsonify({
            "firstName": firstName,
            "lastName": lastName,
            "idNumber": id_number
        }), 200
        
    except Exception as e:
        logger.error(f"Identity extraction error: {str(e)}")
        return jsonify({"error": str(e)}), 500

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
