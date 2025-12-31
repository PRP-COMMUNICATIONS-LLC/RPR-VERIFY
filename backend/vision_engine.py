#!/usr/bin/env python3
"""
Vision Audit Engine - Forensic Discrepancy Detection
Uses Gemini 1.5 Flash to audit bank slips with 1% discrepancy threshold
"""

import json
import os
import logging
# Fix for Python 3.9 metadata attribute error
try:
    import importlib_metadata as metadata
except ImportError:
    from importlib import metadata

# CONFIGURATION
# Default to Singapore (asia-southeast1) for RPR sovereignty
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "rpr-verify-b")
LOCATION = os.environ.get("GOOGLE_CLOUD_REGION", "asia-southeast1")
MODEL_ID = "gemini-1.5-flash-001"
# Modern Google GenAI SDK
from google import genai
from google.cloud import secretmanager
from firebase_admin import firestore
from datetime import datetime

class VisionAuditEngine:
    def __init__(self):
        self.db = firestore.client()
        self.api_key = os.getenv("GEMINI_API_KEY") or self._get_secret("gemini-api-key")
        # Modern client initialization
        self.client = genai.Client(api_key=self.api_key)

    def scan_slip(self, file_bytes, mime_type, forensic_metadata=None):
        """
        Analyzes a bank slip image/PDF to extract forensic metadata.

        Args:
            file_bytes: Binary file data
            mime_type: MIME type of the file
            forensic_metadata: Optional dict with caseId, analystId, documentType, priority, reportId
        """
        if not self.model:
            return {"error": "Vision Engine not initialized", "success": False}
    def _get_secret(self, secret_id):
        try:
            client = secretmanager.SecretManagerServiceClient()
            name = f"projects/rpr-verify-b/secrets/{secret_id}/versions/latest"
            response = client.access_secret_version(request={"name": name})
            return response.payload.data.decode("UTF-8")
        except Exception:
            return None

    def audit_slip(self, drive_file_id, file_bytes, declared_metadata, report_id, admin_email, mime_type='image/jpeg'):
        """Forensic vision audit with 1% discrepancy detection."""
        try:
            image_part = Part.from_data(file_bytes, mime_type=mime_type)
            
            # Enhanced prompt with forensic context
            metadata_context = ""
            if forensic_metadata:
                metadata_context = f"""
                Forensic Context:
                - Case ID: {forensic_metadata.get('caseId', 'N/A')}
                - Analyst ID: {forensic_metadata.get('analystId', 'N/A')}
                - Document Type: {forensic_metadata.get('documentType', 'BANK_SLIP')}
                - Priority: {forensic_metadata.get('priority', 'MEDIUM')}

                """
            
            prompt = f"""
            {metadata_context}You are a forensic auditor for RPR-VERIFY. Extract the following data from this bank transfer slip:
            1. Amount (number only, remove currency symbols)
            2. Transaction Date (ISO 8601 format YYYY-MM-DD)
            3. Recipient Account Number (digits only, remove spaces/dashes)
            4. Institution Name (Bank)
            5. Reference ID (if visible)
            
            Return ONLY valid JSON. No markdown formatting.
            Schema:
            {{
                "amount": float,
                "date": "string",
                "accountNumber": "string",
                "institution": "string",
                "referenceId": "string"
            }}
            """
            prompt = """Extract bank slip data as JSON:
            { "amount": <number>, "date": "YYYY-MM-DD", "bsb": "<string>", "account": "<string>", "confidence": <0-1> }"""

            # Modern Generate Content call
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=[prompt, {'mime_type': mime_type, 'data': file_bytes}]
            )
            
            # Extract JSON from response text
            extracted_text = response.text
            # Clean up potential markdown formatting from AI response
            if "```json" in extracted_text:
                extracted_text = extracted_text.split("```json")[1].split("```")[0].strip()
            
            extracted = json.loads(extracted_text)
            
            # 1% Discrepancy Logic
            declared_amount = float(declared_metadata.get('amount', 0))
            amount_diff = abs(extracted['amount'] - declared_amount)
            threshold = declared_amount * 0.01
            
            risk_level = 2 if amount_diff > threshold else 0

            # Persistence
            self.db.collection('escalations').document(report_id).set({
                'reportId': report_id,
                'extractedMetadata': extracted,
                'escalationLevel': risk_level,
                'auditedBy': admin_email,
                'auditedAt': datetime.utcnow().isoformat() + "Z",
                'status': 'AUDITED',
                'driveFileId': drive_file_id
            }, merge=True)

            return {'status': 'success', 'risk_level': risk_level, 'extracted': extracted}
        except Exception as e:
            logging.error(f"Vision Engine Error: {str(e)}")
            raise RuntimeError(f"Audit processing failed: {str(e)}")
