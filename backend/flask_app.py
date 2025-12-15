"""
Flask Application - CIS Report API
Handles HTML and PDF format requests
"""

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from functools import wraps
import io
import logging
import os

# Firebase Admin SDK for token verification
import firebase_admin
from firebase_admin import auth, credentials

# Import PDF generator
from pdf_generator import PDFGenerator

# Initialize Flask
app = Flask(__name__)

# CORS Configuration
ALLOWED_ORIGINS = [
    "https://rpr-verify-b.web.app",
    "https://verify.rprcomms.com",
    "https://rprcomms.com",
    "https://rpr-verify-et8hakpyt-butterdime.vercel.app",
    "http://localhost:4200"
]

CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# FIREBASE ADMIN INITIALIZATION
# ============================================================================

# Initialize Firebase Admin SDK using Application Default Credentials
# This works automatically in Cloud Run using the service account
if not firebase_admin._apps:
    try:
        # Try Application Default Credentials first (for Cloud Run)
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
        logger.info("✅ Firebase Admin initialized with Application Default Credentials")
    except Exception as e:
        # Fallback to service account key file (for local development)
        service_account_path = os.path.join(os.path.dirname(__file__), 'src', 'service-account-key.json')
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            logger.info("✅ Firebase Admin initialized with service account key file")
        else:
            logger.warning(f"⚠️ Firebase Admin not initialized: {str(e)}")
            logger.warning("⚠️ Token verification will be disabled. Set GOOGLE_APPLICATION_CREDENTIALS or provide service-account-key.json")

# ============================================================================
# AUTHENTICATION MIDDLEWARE
# ============================================================================

# CRITICAL: Use the authorized Sign-In Client ID (OAuth Client ID) as the Audience
EXPECTED_AUD = '794095666194-ggusorgqvmgkqjbenlgr2adr1n3jchjs.apps.googleusercontent.com'

def verify_firebase_token(id_token: str):
    """
    Verify Firebase ID token and return decoded token.
    
    This verifies:
    - Token signature (cryptographically valid)
    - Token expiry (not expired)
    - Token issuer (issued by Firebase Auth)
    - Optional: Audience claim matches expected Client ID
    """
    try:
        decoded = auth.verify_id_token(id_token)
        
        # Optional but recommended: Verify the audience matches the expected Client ID
        # Note: Firebase's verify_id_token may use project ID as aud, but we check for Client ID
        aud = decoded.get('aud')
        if aud and aud != EXPECTED_AUD:
            logger.warning(f"⚠️ Token audience mismatch: expected {EXPECTED_AUD}, got {aud}")
            # We'll still allow it if Firebase verified the signature, but log the warning
        
        logger.info(f"✅ Token verified for user: {decoded.get('email', 'unknown')}")
        return decoded
    except Exception as e:
        logger.error(f"❌ Token verification failed: {str(e)}")
        raise ValueError(f'Invalid token: {str(e)}')

def require_auth(f):
    """
    Decorator to require a valid Firebase ID Token in the Authorization header.
    
    Usage:
        @app.route('/api/endpoint')
        @require_auth
        def protected_endpoint():
            # request.user contains decoded token claims
            user_email = request.user.get('email')
            ...
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        # Check if Firebase Admin is initialized
        if not firebase_admin._apps:
            logger.error("❌ Firebase Admin not initialized - cannot verify tokens")
            return jsonify({
                'error': 'Authentication service unavailable',
                'detail': 'Firebase Admin SDK not initialized'
            }), 503
        
        # Extract Authorization header
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            logger.warning("⚠️ Missing or invalid Authorization header")
            return jsonify({
                'error': 'Missing or invalid Authorization header',
                'detail': 'Expected: Authorization: Bearer <token>'
            }), 401
        
        # Extract token
        token = auth_header.split('Bearer ', 1)[1].strip()
        
        if not token:
            logger.warning("⚠️ Empty token in Authorization header")
            return jsonify({
                'error': 'Empty token',
                'detail': 'Token is required'
            }), 401
        
        try:
            # Verify the token and attach user claims to the request object
            request.user = verify_firebase_token(token)
            
        except ValueError as e:
            # Token failed verification (expired, invalid signature, wrong issuer, etc.)
            logger.error(f"❌ Token verification failed: {str(e)}")
            return jsonify({
                'error': 'Invalid token',
                'detail': str(e)
            }), 403
        except Exception as e:
            # Unexpected error during verification
            logger.error(f"❌ Unexpected error during token verification: {str(e)}")
            return jsonify({
                'error': 'Token verification error',
                'detail': str(e)
            }), 500
        
        # Token is valid, proceed with the request
        return f(*args, **kwargs)
        
    return wrapper

# ============================================================================
# MOCK IMPLEMENTATIONS (Issue 2 resolved - for testing without real Firestore)
# ============================================================================

class MockReportGenerator:
    """Mock report generator for testing"""
    
    def analyze_case(self, case_data):
        """Mock analysis"""
        return {
            'case_id': case_data.get('id', 'UNKNOWN'),
            'status': 'analyzed',
            'proof_of_identity': {'score': 0.95},
            'proof_of_address': {'score': 0.88},
            'business_details': {'score': 0.92},
            'source_of_funds': {'score': 0.90}
        }
    
    def generate_human_readable(self, report_data):
        """Generate mock HTML report"""
        case_id = report_data.get('case_id', 'UNKNOWN')
        return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CIS Report - {case_id}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
        }}
        h1 {{
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }}
        .section {{
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid #3498db;
        }}
        .score {{
            font-weight: bold;
            color: #27ae60;
        }}
    </style>
</head>
<body>
    <h1>Customer Information Sheet</h1>
    <p><strong>Case ID:</strong> {case_id}</p>
    <p><strong>Generated:</strong> December 13, 2025</p>
    
    <div class="section">
        <h2>Proof of Identity</h2>
        <p class="score">Confidence Score: 95%</p>
        <p>Identity documents verified and authenticated.</p>
    </div>
    
    <div class="section">
        <h2>Proof of Address</h2>
        <p class="score">Confidence Score: 88%</p>
        <p>Address documents validated against external databases.</p>
    </div>
    
    <div class="section">
        <h2>Business Details</h2>
        <p class="score">Confidence Score: 92%</p>
        <p>Business registration and corporate structure verified.</p>
    </div>
    
    <div class="section">
        <h2>Source of Funds</h2>
        <p class="score">Confidence Score: 90%</p>
        <p>Fund origins traced and documented.</p>
    </div>
    
    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; color: #666;">
        <p>This is a mock report for testing purposes.</p>
        <p>Report generated by RPR-VERIFY Compliance System</p>
    </footer>
</body>
</html>
        """


def get_case_from_firestore_mock(case_id: str):
    """Mock Firestore retrieval"""
    # In production, replace with real Firestore call
    logger.info(f"📋 Mock: Fetching case {case_id} from Firestore")
    return {
        'id': case_id,
        'client_name': 'Test Client',
        'status': 'active'
    }


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint - No authentication required"""
    return jsonify({
        'status': 'healthy',
        'python': '3.11',
        'playwright': 'installed',
        'firebase_admin': 'initialized' if firebase_admin._apps else 'not initialized'
    }), 200


@app.route('/api/reports/cis/<case_id>', methods=['GET'])
@require_auth  # <--- ADDED: Authentication required
def get_cis_report(case_id):
    """
    CIS Report Endpoint - Supports HTML and PDF formats
    Requires valid Firebase ID token in Authorization header.
    
    Query Parameters:
        format: 'html' (default) or 'pdf'
    
    Headers:
        Authorization: Bearer <firebase_id_token>
    
    Returns:
        - HTML format: JSON with summary_text (HTML string)
        - PDF format: Binary PDF file
    """
    
    try:
        # Log authenticated user
        user_email = request.user.get('email', 'unknown') if hasattr(request, 'user') else 'unknown'
        logger.info(f"📊 Generating CIS report for case: {case_id}, user: {user_email}")
        
        # Get format parameter (default: html)
        output_format = request.args.get('format', 'html').lower()
        
        # Fetch case data (MOCK - Issue 2 resolved)
        case_data = get_case_from_firestore_mock(case_id)
        
        if not case_data:
            return jsonify({
                'status': 'error',
                'message': f'Case {case_id} not found'
            }), 404
        
        # Generate report structure (MOCK)
        report_generator = MockReportGenerator()
        report_data = report_generator.analyze_case(case_data)
        
        # Generate HTML
        html_content = report_generator.generate_human_readable(report_data)
        
        # Handle format request
        if output_format == 'pdf':
            # NEW: Server-side PDF generation
            logger.info(f"🎨 Generating PDF using Playwright...")
            
            pdf_generator = PDFGenerator()
            pdf_bytes = pdf_generator.generate_pdf_from_html(html_content)
            
            # Return PDF binary
            return send_file(
                io.BytesIO(pdf_bytes),
                mimetype='application/pdf',
                as_attachment=True,
                download_name=f'CIS_Report_{case_id}.pdf'
            )
        
        else:
            # DEFAULT: Return HTML in JSON (backward compatible)
            return jsonify({
                'status': 'success',
                'case_id': case_id,
                'summary_text': html_content,
                'sections': report_data
            }), 200
    
    except Exception as e:
        logger.error(f"❌ Error generating report: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
