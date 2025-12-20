from firebase_admin import auth
from functools import wraps
from flask import request, jsonify
import logging

logger = logging.getLogger(__name__)

def require_rpr_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Ensure Firebase Admin is initialized
        try:
            from flask_app import get_firebase_app
            firebase_app = get_firebase_app()
            if not firebase_app:
                logger.error("Firebase Admin not initialized")
                return jsonify({
                    'error': 'Authentication service unavailable',
                    'message': 'Firebase Admin not initialized'
                }), 503
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin: {e}")
            return jsonify({
                'error': 'Authentication service unavailable',
                'message': str(e)
            }), 503
        
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'error': 'Authentication failed',
                'message': 'Missing or invalid Authorization header'
            }), 401
        
        id_token = auth_header.split('Bearer ')[1]
        
        try:
            decoded_token = auth.verify_id_token(id_token)
            
            email = decoded_token.get('email')
            email_verified = decoded_token.get('email_verified')
            
            if not email or not email_verified or not email.endswith('@rprcomms.com'):
                logger.warning(f"Unauthorized access attempt by {email}")
                return jsonify({
                    'error': 'Authentication failed',
                    'message': 'Access restricted to verified @rprcomms.com administrators'
                }), 403
            
            request.rpr_admin_email = email
            return f(*args, **kwargs)
            
        except auth.InvalidIdTokenError:
            logger.error("Invalid ID token")
            return jsonify({
                'error': 'Authentication failed',
                'message': 'Invalid ID token'
            }), 401
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return jsonify({
                'error': 'Authentication failed',
                'message': 'Authentication error occurred'
            }), 401

    return decorated_function
