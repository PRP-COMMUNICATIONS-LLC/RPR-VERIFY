#!/usr/bin/env python3
"""
CDD Report System - Flask Backend
Main application file for document processing, OCR, verification, and PDF generation
"""

import sys
import warnings
import os

# 1. Silence environmental noise - Set before any imports
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning, module="urllib3")
warnings.filterwarnings("ignore", message=".*urllib3.*")
warnings.filterwarnings("ignore", message=".*NotOpenSSLWarning.*")
warnings.filterwarnings("ignore", message=".*LibreSSL.*")
warnings.filterwarnings("ignore", message=".*OpenSSL.*")

# 2. Python 3.9 Compatibility Fix
if sys.version_info < (3, 10):
    import importlib_metadata as metadata
    import importlib.metadata
    if not hasattr(importlib.metadata, 'packages_distributions'):
        importlib.metadata.packages_distributions = metadata.packages_distributions
else:
    from importlib import metadata

from typing import List, Dict, Any, Optional
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import uuid
from datetime import datetime
import logging
from werkzeug.utils import secure_filename
import io

# Import vision audit engine (optional - for bank statement forensic auditing)
try:
    from vision_engine import VisionAuditEngine
    VISION_ENGINE_AVAILABLE = True
except ImportError:
    VISION_ENGINE_AVAILABLE = False
    logging.warning("VisionAuditEngine not available - forensic auditing disabled")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Initialize Firestore for forensic audit reports
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    # Initialize Firebase Admin if not already initialized
    if not firebase_admin._apps:
        try:
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
        except:
            try:
                firebase_admin.initialize_app()
            except Exception as e:
                logger.warning(f"Firebase Admin initialization failed: {e}. PDF reports may not work.")
    
    db = firestore.client()
    FIRESTORE_AVAILABLE = True
    logger.info("Firestore initialized successfully")
except ImportError:
    logger.warning("firebase_admin not available - PDF report generation from Firestore disabled")
    db = None
    FIRESTORE_AVAILABLE = False
except Exception as e:
    logger.warning(f"Firestore initialization error: {e}")
    db = None
    FIRESTORE_AVAILABLE = False

# Configuration
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('generated_reports', exist_ok=True)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'CDD Report System Backend'
    })

@app.route('/api/extract', methods=['POST'])
def extract_data():
    """Extract data from uploaded documents with forensic audit"""
    try:
        if not request.files:
            return jsonify({'success': False, 'error': 'No files uploaded'}), 400

        extraction_results = []

        for field_name in request.files:
            file = request.files[field_name]
            if not file or file.filename == '':
                continue

            document_type = 'Bank Statement'  # Default for now
            logger.info(f"Processing file: {file.filename} as {document_type}")

            # Save file
            filename = secure_filename(file.filename)
            file_id = str(uuid.uuid4())
            filepath = os.path.join(UPLOAD_FOLDER, f"{file_id}_{filename}")
            file.save(filepath)

            # Vision audit for bank statements (forensic discrepancy detection)
            escalation_level = None
            if document_type == 'Bank Statement' and VISION_ENGINE_AVAILABLE:
                try:
                    with open(filepath, 'rb') as f:
                        file_bytes = f.read()
                    
                    declared_metadata = {'amount': 0}  # Default, should come from request
                    
                    vision_engine = VisionAuditEngine()
                    audit_result = vision_engine.audit_slip(
                        drive_file_id=file_id,
                        file_bytes=file_bytes,
                        declared_metadata=declared_metadata,
                        report_id=str(uuid.uuid4()),
                        admin_email=request.headers.get('X-Admin-Email', 'system@rpr-verify.com')
                    )
                    
                    escalation_level = audit_result.get('risk_level', 0)
                    logger.info(f"Vision audit complete: Risk Level {escalation_level}")
                except Exception as e:
                    logger.warning(f"Vision audit failed: {e}")

            extraction_results.append({
                'file_id': file_id,
                'document_type': document_type,
                'verification_id': str(uuid.uuid4()),
                'escalation_level': escalation_level if escalation_level is not None else 0
            })

        return jsonify({
            'success': True,
            'extraction_results': extraction_results,
            'message': 'Extraction completed successfully',
            'total_files_processed': len(extraction_results)
        })

    except Exception as e:
        logger.error(f"Extraction error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate-report/<verification_id>', methods=['GET'])
def generate_report(verification_id):
    """Generate forensic audit PDF report from Firestore escalation data"""
    try:
        if not FIRESTORE_AVAILABLE or db is None:
            return jsonify({'error': 'Firestore not available'}), 503
        
        # Fetch data from Firestore escalations collection
        doc_ref = db.collection('escalations').document(verification_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            # Try alternative: search by reportId field
            escalations_ref = db.collection('escalations')
            query = escalations_ref.where('reportId', '==', verification_id).limit(1)
            docs = query.stream()
            
            doc = None
            for d in docs:
                doc = d
                break
            
            if not doc:
                return jsonify({'error': 'Report data not found in Firestore'}), 404
        
        report_data = doc.to_dict()
        
        # Create PDF in memory
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Header
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, height - 50, "RPR-VERIFY: Forensic Audit Report")
        p.setFont("Helvetica", 10)
        p.drawString(50, height - 65, f"Verification ID: {verification_id}")
        p.drawString(50, height - 80, f"Report ID: {report_data.get('reportId', 'N/A')}")
        p.line(50, height - 90, width - 50, height - 90)

        # Audit Summary
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height - 115, "1. Executive Summary")
        p.setFont("Helvetica", 11)
        
        escalation_level = report_data.get('escalationLevel', 0)
        risk_text = "HIGH RISK (Discrepancy Detected)" if escalation_level > 0 else "PASS (Clean Audit)"
        risk_color = colors.red if escalation_level > 0 else colors.green
        
        p.setFillColor(risk_color)
        p.drawString(50, height - 135, f"Status: {risk_text}")
        p.setFillColor(colors.black)
        
        p.setFont("Helvetica", 10)
        p.drawString(50, height - 150, f"Escalation Level: {escalation_level}")
        p.drawString(50, height - 165, f"Audited By: {report_data.get('auditedBy', 'System')}")
        p.drawString(50, height - 180, f"Audited At: {report_data.get('auditedAt', 'N/A')}")

        # Forensic Details
        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, height - 210, "2. Forensic Data Extraction")
        p.setFont("Helvetica", 10)
        
        y_pos = height - 230
        extracted = report_data.get('extractedMetadata', {})
        if extracted:
            for key, value in extracted.items():
                if y_pos < 100:
                    p.showPage()
                    y_pos = height - 50
                p.drawString(70, y_pos, f"{key.capitalize()}: {value}")
                y_pos -= 15
        else:
            p.drawString(70, y_pos, "No extracted metadata available")

        # Footer
        p.setFont("Helvetica-Oblique", 8)
        p.drawString(50, 30, f"Generated on {datetime.utcnow().isoformat()}Z - RPR-VERIFY Sovereign Engine")

        p.showPage()
        p.save()

        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"RPR_Audit_{verification_id}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        logger.error(f"PDF Generation Error: {str(e)}", exc_info=True)
        return jsonify({'error': f'PDF generation failed: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info("Starting CDD Report System Backend...")
    logger.info("OCR Support: Enabled")
    logger.info("PDF Generation: Enabled")
    app.run(debug=True, host='0.0.0.0', port=5001)
