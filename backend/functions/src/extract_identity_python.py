# -*- coding: utf-8 -*-
"""RPR-VERIFY Identity Extraction Cloud Function

HTTP callable function that extracts identity (name and document ID) from documents
using Gemini 1.5 Flash for zero-touch project initialization.

Deployment: gcloud functions deploy extract_identity_python \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --region asia-southeast1
"""

import os
import json
import base64
from typing import Dict, Any
from flask import Request, jsonify

# Import the vision engine
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from vision_engine import extract_identity, DocumentParseError, RateLimitError


def extract_identity_python_handler(request: Request) -> tuple:
    """
    Cloud Function handler for identity extraction.
    
    Expected request body:
    {
        "image": "base64_encoded_image_string"
    }
    
    Returns:
    {
        "firstName": "GAVRIL",
        "lastName": "VASILE",
        "idNumber": "3554361"
    }
    """
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    # Set CORS headers for actual request
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
    
    try:
        # Parse request body
        if request.method != 'POST':
            return (jsonify({"error": "Method not allowed"}), 405, headers)
        
        request_json = request.get_json(silent=True)
        if not request_json:
            return (jsonify({"error": "Invalid JSON body"}), 400, headers)
        
        # Get base64 image from request
        image_base64 = request_json.get('image', '').strip()
        if not image_base64:
            return (jsonify({"error": "image is required"}), 400, headers)
        
        # Decode base64 to bytes for vision engine
        try:
            image_bytes = base64.b64decode(image_base64)
        except Exception as e:
            return (jsonify({"error": "Invalid base64 image encoding", "details": str(e)}), 400, headers)
        
        # Call vision engine to extract identity
        identity_result = extract_identity(image_bytes)
        
        # Parse name using first-word split logic
        # firstName = first word, lastName = rest of the words
        full_name = identity_result.get('name', '').strip()
        name_parts = full_name.split()
        
        if len(name_parts) == 0:
            return (jsonify({"error": "No name extracted from document"}), 400, headers)
        elif len(name_parts) == 1:
            # Single word - treat as lastName
            firstName = ''
            lastName = name_parts[0]
        else:
            # Multiple words - first word is firstName, rest is lastName
            firstName = name_parts[0]
            lastName = ' '.join(name_parts[1:])
        
        # Get document ID
        id_number = identity_result.get('id', '').strip()
        if not id_number:
            return (jsonify({"error": "No document ID extracted"}), 400, headers)
        
        # Return structured response
        return (jsonify({
            "firstName": firstName,
            "lastName": lastName,
            "idNumber": id_number
        }), 200, headers)
    
    except DocumentParseError as e:
        return (jsonify({"error": "Document parsing failed", "details": str(e)}), 400, headers)
    except RateLimitError as e:
        return (jsonify({"error": "Rate limit exceeded", "details": "Please try again later"}), 429, headers)
    except Exception as e:
        print(f"Error extracting identity: {str(e)}")
        return (jsonify({"error": "Internal server error", "details": str(e)}), 500, headers)


# Entry point for Cloud Functions
def extract_identity_python_http(request: Request) -> tuple:
    """HTTP entry point for Cloud Functions."""
    return extract_identity_python_handler(request)
