# -*- coding: utf-8 -*-
"""RPR-VERIFY Vision Engine
Phase 4: Forensic OCR with Regional Lock and Error Topology

Sovereign Alignment: asia-southeast1 (Singapore residency enforced)
Authority: PRD v12.4 - Phase 4 Execution Roadmap
"""

import os
import json
from datetime import datetime, timezone
import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, HarmCategory, HarmBlockThreshold
from tenacity import retry, stop_after_attempt, wait_exponential
import firebase_admin
from dateutil.parser import parse as parse_date


# Defined per Phase 4, Step 1
class VisionEngineError(Exception):
    """Base class for all vision-related errors."""
    pass

class RateLimitError(VisionEngineError): pass
class DocumentParseError(VisionEngineError): pass
class ValidationError(VisionEngineError): pass
class RegionalLockError(VisionEngineError): pass
class ForensicMetadataError(VisionEngineError): pass

# --- STEP 2: Vertex AI Hardening ---

# Regional Lockdown: Explicit asia-southeast1 binding for Singapore residency
PROJECT_ID = os.getenv('GOOGLE_CLOUD_PROJECT', 'rpr-verify-b')
REGION = 'asia-southeast1'
vertexai.init(project=PROJECT_ID, location=REGION)

# Safety Anchor: BLOCK_NONE for financial document processing (avoids false positives)
SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]

# Convert to VertexAI objects for model usage
vertex_safety_settings = [
    SafetySetting(
        category=getattr(HarmCategory, s["category"]), 
        threshold=getattr(HarmBlockThreshold, s["threshold"])
    ) for s in SAFETY_SETTINGS
]

model = GenerativeModel("gemini-1.5-flash-001")

@retry(
    stop=stop_after_attempt(4),
    wait=wait_exponential(multiplier=1, min=1, max=8),
    reraise=True
)
def extract_identity(image_content):
    """
    Lightweight identity extraction for zero-touch project initialization.
    Extracts only the full name and document ID from a forensic document.
    
    Args:
        image_content: Base64-encoded image or image bytes
        
    Returns:
        dict: { name: string, id: string }
        
    Raises:
        RateLimitError: If Vertex AI quota exceeded (429 response)
        DocumentParseError: If OCR extraction fails
    """
    prompt = """
Extract only the FULL NAME and DOCUMENT ID from this forensic document. Return as JSON: { "name": "string", "id": "string" }.
Focus on:
- Full legal name (first name and last name)
- Document identification number (ID number, passport number, etc.)
Return JSON ONLY, no additional text.
"""
    
    try:
        response = model.generate_content(
            [image_content, prompt],
            safety_settings=vertex_safety_settings
        )
        
        # Parse JSON response
        response_text = response.text.replace("```json", "").replace("```", "").strip()
        identity_result = json.loads(response_text)
        
        # Validate required fields
        if not identity_result.get('name') or not identity_result.get('id'):
            raise DocumentParseError("Failed to extract name or ID from document")
        
        return {
            "name": identity_result.get('name', '').strip(),
            "id": identity_result.get('id', '').strip()
        }
    
    except json.JSONDecodeError as e:
        raise DocumentParseError(f"Failed to parse identity extraction response: {str(e)}")
    except Exception as e:
        if "429" in str(e):
            raise RateLimitError()
        raise DocumentParseError(str(e))


@retry(
    stop=stop_after_attempt(4),
    wait=wait_exponential(multiplier=1, min=1, max=8),
    reraise=True
)
def extract_document_data(image_content, case_id):
    """
    Core extraction logic with exponential backoff and forensic metadata tagging.
    
    Args:
        image_content: Base64-encoded image or image bytes
        case_id: Mandatory Case ID for audit trail
        
    Returns:
        dict: Structured response with forensic metadata and extracted data
        
    Raises:
        ForensicMetadataError: If case_id is missing
        RateLimitError: If Vertex AI quota exceeded (429 response)
        DocumentParseError: If OCR extraction fails
    """
    if not case_id:
        error = ForensicMetadataError("Missing Case ID in request packet.")
        error.error_code = "AUDIT_TRAIL_BROKEN"
        raise error
    
    prompt = """
Perform forensic OCR on this document. Return JSON ONLY.
Schema:
{
  "issuing_authority_poi": {"doc_id": "string", "expiry": "string", "legal_name": "string"},
  "issuing_authority_poa": {"account_num": "string", "address": "string", "issue_date": "string"},
  "financial_institution": {"bsb": "string", "account_num": "string", "holder_name": "string"}
}
"""
    
    try:
        response = model.generate_content(
            [image_content, prompt],
            safety_settings=vertex_safety_settings
        )
        
        # --- STEP 3: Forensic Metadata Integration ---
        ocr_result = json.loads(response.text.replace("```json", "").replace("```", ""))
        
        return {
            "status": "success",
            "case_id": case_id,  # Mandatory Echo
            "forensic_metadata": {
                "case_id": case_id,
                "extracted_by": "gemini-1.5-flash-001",
                "region": REGION,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "model_version": "1.5-flash-001",
                "safety_threshold": "BLOCK_NONE"
            },
            "data": ocr_result
        }
    
    except Exception as e:
        if "429" in str(e):
            raise RateLimitError()
        raise DocumentParseError(str(e))


def normalize_date(date_string):
    """Normalize date strings to ISO 8601 format."""
    try:
        return parse_date(date_string).strftime('%Y-%m-%d')
    except (ValueError, TypeError):
        return None


def mask_account_number(account_number):
    """Mask account number, showing only the last 4 digits."""
    if not isinstance(account_number, str):
        return account_number
    if len(account_number) <= 4:
        return "*" * len(account_number)
    return f"****-{account_number[-4:]}"


def compute_risk_score(declared_metadata, extracted_metadata):
    """Compute risk score based on metadata mismatch."""
    score = 100
    risk_marker = 0

    # Amount mismatch
    amount_diff = abs(declared_metadata.get('amount', 0) - extracted_metadata.get('amount', 0))
    if amount_diff > 0.05 * declared_metadata.get('amount', 0):
        score -= 50
        risk_marker = 3
    elif amount_diff > 0.01 * declared_metadata.get('amount', 0):
        score -= 20
        risk_marker = 2

    # Date mismatch
    if normalize_date(declared_metadata.get('date')) != normalize_date(extracted_metadata.get('date')):
        score -= 25
        risk_marker = max(risk_marker, 1)

    return {"matchScore": score, "riskMarker": risk_marker}


class VisionAuditEngine:
    def __init__(self):
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
        self.db = firebase_admin.firestore.client()

    def audit_slip(self, drive_file_id, file_bytes, declared_metadata, report_id, admin_email):
        """Orchestrate the vision audit process."""
        # 1. Forensic Extraction
        extracted_data = extract_document_data(file_bytes, report_id)

        # 2. Risk Scoring
        risk_result = compute_risk_score(declared_metadata, extracted_data['data'])

        # 3. PII Masking
        if 'accountNumber' in extracted_data['data']:
            extracted_data['data']['accountNumber'] = mask_account_number(extracted_data['data']['accountNumber'])

        # 4. Final Report
        final_report = {
            "status": "success",
            "driveFileId": drive_file_id,
            "reportId": report_id,
            "adminEmail": admin_email,
            "declaredMetadata": declared_metadata,
            "extractedMetadata": extracted_data['data'],
            "forensicMetadata": extracted_data['forensic_metadata'],
            **risk_result
        }

        # 5. Firestore Persistence
        self.db.collection('rpr_vision_audit_reports').document(report_id).set(final_report)

        return final_report
