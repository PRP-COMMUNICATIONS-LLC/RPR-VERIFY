# LAZY IMPORT: Import firebase_admin.auth only when needed to prevent boot-time OOM
from functools import wraps
from flask import request, jsonify
import logging
import os

logger = logging.getLogger(__name__)

# Load the authorized emails from the environment variable
# This is set by operations/load_secrets.sh
AUTHORIZED_EMAILS = os.environ.get('AUTH_EMAILS', '').split(',')

def require_rpr_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # [cite_start]Verify Authorization header exists [cite: 8, 9]
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized', 'message': 'Missing or invalid token'}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        try:
            # LAZY IMPORT: Import auth only when actually verifying a token
            from firebase_admin import auth
            # [cite_start]Verify the Firebase ID token [cite: 9]
            decoded_token = auth.verify_id_token(id_token)
            email = decoded_token.get('email', '')
            email_verified = decoded_token.get('email_verified', False)
            
            # [cite_start]Restrict access to verified Sovereign administrators [cite: 10]
            if not email in AUTHORIZED_EMAILS or not email_verified:
                logger.warning(f"Access denied for user: {email}")
                return jsonify({'error': 'Forbidden', 'message': 'Access restricted to Sovereign Gatekeeper verified administrators'}), 403
            
            # [cite_start]Attach admin email for downstream audit logging [cite: 11]
            request.rpr_admin_email = email
            return f(*args, **kwargs)
            
        except Exception as e:
            logger.error(f"Authentication failure: {str(e)}")
            return jsonify({'error': 'Unauthorized', 'message': 'The provided token is invalid'}), 401
            
    return decorated_function