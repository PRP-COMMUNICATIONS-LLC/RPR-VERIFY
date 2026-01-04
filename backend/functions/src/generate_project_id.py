# -*- coding: utf-8 -*-
"""RPR-VERIFY Project ID Generation Cloud Function

HTTP callable function that generates project IDs using Firestore transactions
to ensure atomic sequence increments.

Deployment: gcloud functions deploy generate_project_id \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --region asia-southeast1
"""

import os
import json
from datetime import date, datetime
from typing import Dict, Any
import firebase_admin
from firebase_admin import firestore, credentials
from flask import Request, jsonify

# Import the ID generator utility
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
from id_generator import generate_project_id

# Initialize Firebase Admin if not already initialized
if not firebase_admin._apps:
    # Try to use default credentials (works in Cloud Functions)
    try:
        firebase_admin.initialize_app()
    except Exception as e:
        # Fallback for local testing
        if os.path.exists('service-account-key.json'):
            cred = credentials.Certificate('service-account-key.json')
            firebase_admin.initialize_app(cred)

db = firestore.client()


def generate_project_id_handler(request: Request) -> tuple:
    """
    Cloud Function handler for generating project IDs.
    
    Expected request body:
    {
        "last_name": "Vasile",
        "reference_date": "2026-01-20" (optional, defaults to today)
    }
    
    Returns:
    {
        "project_id": "VASILE-001-2026-W03",
        "year": 2026,
        "week": 3,
        "sequence": 1
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
        
        last_name = request_json.get('last_name', '').strip()
        if not last_name:
            return (jsonify({"error": "last_name is required"}), 400, headers)
        
        # Parse reference date or use today
        reference_date_str = request_json.get('reference_date')
        if reference_date_str:
            try:
                reference_date = datetime.strptime(reference_date_str, '%Y-%m-%d').date()
            except ValueError:
                return (jsonify({"error": "Invalid reference_date format. Use YYYY-MM-DD"}), 400, headers)
        else:
            reference_date = date.today()
        
        # Get ISO year for counter document key
        iso_year, iso_week, _ = reference_date.isocalendar()
        
        # Normalize last name for counter key (same as in id_generator)
        import re
        normalized_name = re.sub(r'[^A-Z0-9]', '', last_name.upper())
        counter_doc_id = f"{iso_year}_{normalized_name}"
        
        # Firestore Transaction: Atomically increment sequence counter
        transaction = db.transaction()
        counter_ref = db.collection('counters').document(counter_doc_id)
        
        @firestore.transactional
        def increment_sequence(transaction):
            """Atomically increment the sequence counter."""
            snapshot = counter_ref.get(transaction=transaction)
            
            if snapshot.exists:
                current_seq = snapshot.get('current_seq', 0)
                new_seq = current_seq + 1
            else:
                new_seq = 1
            
            # Update or create the counter document
            transaction.set(counter_ref, {
                'current_seq': new_seq,
                'last_name': normalized_name,
                'year': iso_year,
                'last_updated': firestore.SERVER_TIMESTAMP
            }, merge=True)
            
            return new_seq
        
        # Execute transaction
        new_sequence = increment_sequence(transaction)
        
        # Generate the project ID
        result = generate_project_id(last_name, reference_date, new_sequence)
        
        # Store project record in Firestore
        project_ref = db.collection('projects').document(result['id'])
        project_data = {
            'project_id': result['id'],
            'client_meta': {
                'last_name': normalized_name,
                'first_name': request_json.get('first_name', '').strip(),
                'poi_id': request_json.get('poi_id', '').strip()
            },
            'nexus': {
                'bsb': request_json.get('bsb', '').strip(),
                'account': request_json.get('account', '').strip()
            },
            'temporal': {
                'year': result['year'],
                'week': result['week'],
                'sequence': result['sequence'],
                'created_at': firestore.SERVER_TIMESTAMP
            },
            'status': 'ACTIVE'
        }
        
        project_ref.set(project_data)
        
        # Return success response
        return (jsonify({
            "project_id": result['id'],
            "year": result['year'],
            "week": result['week'],
            "sequence": result['sequence']
        }), 200, headers)
    
    except ValueError as e:
        return (jsonify({"error": str(e)}), 400, headers)
    except Exception as e:
        print(f"Error generating project ID: {str(e)}")
        return (jsonify({"error": "Internal server error", "details": str(e)}), 500, headers)


# Entry point for Cloud Functions
def generate_project_id_http(request: Request) -> tuple:
    """HTTP entry point for Cloud Functions."""
    return generate_project_id_handler(request)
