"""
Vision Audit Engine - Phase 4
Uses Google Gen AI SDK with Gemini 2.5 Flash for high-fidelity forensic extraction.
Enforces Structured Outputs to map model perception directly into backend schemas.
"""
import json
import logging
import re
import os
import sys
from typing import Dict, Any, Optional
from datetime import datetime
import google.generativeai as old_genai
from google import genai
from google.genai import types
from google.cloud import secretmanager
from firebase_admin import firestore

# Ensure the operations package is discoverable from the backend context
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import Notion handler for escalation
try:
    from operations.notion_report_handler import create_rpr_verify_task
    NOTION_AVAILABLE = True
except ImportError:
    NOTION_AVAILABLE = False
    create_rpr_verify_task = None
    logger = logging.getLogger(__name__)
    logger.warning("⚠️ Notion handler not available - escalation tasks will not be created")

logger = logging.getLogger(__name__)


def normalize_date(date_str: str) -> str:
    """
    Normalize date strings from OCR to ISO format (YYYY-MM-DD).
    Handles various formats like "20 Dec 2025", "12/20/2025", "2025-12-20", etc.
    
    Args:
        date_str: Date string from OCR extraction
        
    Returns:
        Normalized date string in ISO format (YYYY-MM-DD)
    """
    if not date_str:
        return ""
    
    # Try common date formats
    date_formats = [
        "%Y-%m-%d",           # 2025-12-20
        "%d/%m/%Y",           # 20/12/2025
        "%m/%d/%Y",           # 12/20/2025
        "%d-%m-%Y",           # 20-12-2025
        "%d %b %Y",           # 20 Dec 2025
        "%d %B %Y",           # 20 December 2025
        "%Y/%m/%d",           # 2025/12/20
    ]
    
    # Clean the string
    date_str = date_str.strip()
    
    # Try parsing with each format
    for fmt in date_formats:
        try:
            parsed = datetime.strptime(date_str, fmt)
            return parsed.strftime("%Y-%m-%d")
        except ValueError:
            continue
    
    # If all formats fail, try regex extraction
    # Look for patterns like "20 Dec 2025" or "12/20/2025"
    patterns = [
        r'(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})',  # 20 Dec 2025
        r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})',      # 12/20/2025 or 12-20-2025
        r'(\d{4})[/-](\d{1,2})[/-](\d{1,2})',      # 2025/12/20
    ]
    
    for pattern in patterns:
        match = re.search(pattern, date_str)
        if match:
            try:
                if len(match.groups()) == 3:
                    # Try to parse as date
                    parts = match.groups()
                    # Heuristic: if first part is 4 digits, it's year-first
                    if len(parts[0]) == 4:
                        year, month, day = parts
                    else:
                        # Assume day/month/year or month/day/year
                        # For US format, try month/day/year first
                        month, day, year = parts
                        # Validate month is 1-12
                        if int(month) > 12:
                            day, month, year = parts
                    
                    parsed = datetime(int(year), int(month), int(day))
                    return parsed.strftime("%Y-%m-%d")
            except (ValueError, IndexError):
                continue
    
    # If all parsing fails, return original string
    logger.warning(f"⚠️ Could not normalize date: {date_str}")
    return date_str


def mask_account_number(account_number: str) -> str:
    """
    Mask account number to show only last 4 digits.
    Format: ****-1234
    
    Args:
        account_number: Full account number string
        
    Returns:
        Masked account number (e.g., "****-1234")
    """
    if not account_number:
        return ""
    
    # Remove any non-digit characters
    digits_only = re.sub(r'\D', '', account_number)
    
    if len(digits_only) < 4:
        # If less than 4 digits, mask all
        return "*" * len(digits_only)
    
    # Show last 4 digits
    last_four = digits_only[-4:]
    return f"****-{last_four}"


def compute_risk_score(
    declared_metadata: Dict[str, Any],
    extracted_metadata: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Compute risk score by comparing extracted data against user-declared metadata.
    
    Args:
        declared_metadata: User-declared metadata (amount, date, accountNumber, institution)
        extracted_metadata: Extracted metadata from vision engine
        
    Returns:
        Dict with:
            - matchScore: 0-100 (higher = better match)
            - riskMarker: 0-3 (0=low, 1=medium, 2=high, 3=critical/escalate)
            - mismatches: List of mismatched fields
    """
    match_score = 100
    mismatches = []
    
    # Normalize dates for comparison
    declared_date = normalize_date(declared_metadata.get('date', ''))
    extracted_date = normalize_date(extracted_metadata.get('date', ''))
    
    # Compare amount (most critical)
    declared_amount = float(declared_metadata.get('amount', 0))
    extracted_amount = float(extracted_metadata.get('amount', 0))
    
    if declared_amount > 0:
        amount_diff = abs(extracted_amount - declared_amount)
        amount_diff_pct = (amount_diff / declared_amount) * 100
        
        if amount_diff_pct > 5.0:  # >5% difference
            match_score -= 40
            mismatches.append({
                'field': 'amount',
                'declared': declared_amount,
                'extracted': extracted_amount,
                'difference': amount_diff,
                'severity': 'CRITICAL'
            })
        elif amount_diff_pct > 1.0:  # >1% difference
            match_score -= 20
            mismatches.append({
                'field': 'amount',
                'declared': declared_amount,
                'extracted': extracted_amount,
                'difference': amount_diff,
                'severity': 'HIGH'
            })
        elif amount_diff_pct > 0.1:  # >0.1% difference
            match_score -= 10
            mismatches.append({
                'field': 'amount',
                'declared': declared_amount,
                'extracted': extracted_amount,
                'difference': amount_diff,
                'severity': 'MEDIUM'
            })
    
    # Compare dates
    if declared_date and extracted_date:
        if declared_date != extracted_date:
            match_score -= 15
            mismatches.append({
                'field': 'date',
                'declared': declared_date,
                'extracted': extracted_date,
                'severity': 'MEDIUM'
            })
    
    # Compare account numbers (masked comparison)
    declared_account = mask_account_number(declared_metadata.get('accountNumber', ''))
    extracted_account = mask_account_number(extracted_metadata.get('accountNumber', ''))
    
    if declared_account and extracted_account:
        if declared_account != extracted_account:
            match_score -= 25
            mismatches.append({
                'field': 'accountNumber',
                'declared': declared_account,
                'extracted': extracted_account,
                'severity': 'HIGH'
            })
    
    # Compare institutions (case-insensitive)
    declared_institution = declared_metadata.get('institution', '').lower().strip()
    extracted_institution = extracted_metadata.get('institution', '').lower().strip()
    
    if declared_institution and extracted_institution:
        if declared_institution != extracted_institution:
            match_score -= 10
            mismatches.append({
                'field': 'institution',
                'declared': declared_metadata.get('institution', ''),
                'extracted': extracted_metadata.get('institution', ''),
                'severity': 'LOW'
            })
    
    # Ensure match score is between 0-100
    match_score = max(0, min(100, match_score))
    
    # Determine risk marker based on match score and mismatches
    risk_marker = 0
    if match_score < 50:
        risk_marker = 3  # Critical - escalate to Notion
    elif match_score < 70:
        risk_marker = 2  # High risk
    elif match_score < 85:
        risk_marker = 1  # Medium risk
    else:
        risk_marker = 0  # Low risk
    
    # Override: if amount mismatch is critical, force risk_marker = 3
    critical_amount_mismatch = any(
        m.get('field') == 'amount' and m.get('severity') == 'CRITICAL'
        for m in mismatches
    )
    if critical_amount_mismatch:
        risk_marker = 3
    
    return {
        'matchScore': round(match_score, 2),
        'riskMarker': risk_marker,
        'mismatches': mismatches
    }


class VisionAuditEngine:
    def __init__(self):
        """Initialize the Vision Audit Engine with Gemini API key from Secret Manager."""
        try:
            # Try to get API key from environment first (for local testing), then Secret Manager
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                api_key = self._get_secret('gemini-api-key')
            
            # Initialize the new Google Gen AI SDK client
            self.client = genai.Client(api_key=api_key)
            # Resolved: Using the correct stable model identifier
            self.model_id = 'gemini-1.5-flash'
            logger.info(f"✅ VisionAuditEngine initialized with {self.model_id} using google-genai SDK")
        except Exception as e:
            logger.error(f"❌ Failed to initialize VisionAuditEngine: {str(e)}")
            raise RuntimeError(f"Vision engine initialization failed: {str(e)}")

    def _get_secret(self, secret_id):
        """Retrieve secret from Google Secret Manager."""
        try:
            client = secretmanager.SecretManagerServiceClient()
            name = f"projects/rpr-verify-b/secrets/{secret_id}/versions/latest"
            response = client.access_secret_version(request={"name": name})
            return response.payload.data.decode("UTF-8")
        except Exception as e:
            logger.error(f"❌ Error retrieving secret {secret_id}: {str(e)}")
            raise

    def audit_slip(
        self,
        drive_file_id: str,
        file_bytes: bytes,
        declared_metadata: Dict[str, Any],
        report_id: str,
        admin_email: str
    ) -> Dict[str, Any]:
        """
        Forensic audit of a bank slip using Gemini Vision with Structured Outputs.
        
        Args:
            drive_file_id: ID of the file in Google Drive
            file_bytes: Raw file content (image bytes)
            declared_metadata: Metadata declared by the user (amount, date, accountNumber, institution)
            report_id: ID of the report in Firestore
            admin_email: Email of the admin performing the audit
            
        Returns:
            Dict with status, risk_level, matchScore, riskMarker, and extracted metadata
        """
        try:
            # Define structured output schema for Gemini
            extraction_schema = {
                "type": "object",
                "properties": {
                    "amount": {"type": "number", "description": "Transaction amount as a float"},
                    "date": {"type": "string", "description": "Transaction date (any format, will be normalized)"},
                    "accountNumber": {"type": "string", "description": "Account number (will be masked)"},
                    "institution": {"type": "string", "description": "Bank or financial institution name"},
                    "confidence": {"type": "number", "description": "Confidence score 0-1"}
                },
                "required": ["amount", "date", "accountNumber", "institution"]
            }
            
            # Prepare prompt with structured output instruction
            prompt = (
                "Extract the following metadata from this bank slip image. "
                "Return a JSON object with these exact fields: "
                "amount (float), date (string), accountNumber (string), institution (string), confidence (float 0-1). "
                "Be precise with the amount and date. Extract the account number exactly as shown. "
                "Return ONLY valid JSON, no markdown formatting."
            )
            
            # Prepare image part for Gemini
            # The google.generativeai SDK accepts image bytes directly
            # We'll use a simple approach - default to JPEG, but try to detect
            import io
            mime_type = "image/jpeg"  # Default
            
            # Try to detect image type from magic bytes
            if file_bytes.startswith(b'\xff\xd8\xff'):
                mime_type = "image/jpeg"
            elif file_bytes.startswith(b'\x89PNG'):
                mime_type = "image/png"
            elif file_bytes.startswith(b'GIF'):
                mime_type = "image/gif"
            elif file_bytes.startswith(b'WEBP', 8):
                mime_type = "image/webp"
            
            # Create image part for the new SDK
            image_part = types.Part.from_bytes(
                data=file_bytes,
                mime_type=mime_type
            )
            
            # Generate content with structured output enforcement
            try:
                response = self.client.models.generate_content(
                    model=self.model_id,
                    contents=[prompt, image_part],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.1,  # Low temperature for accuracy
                    )
                )
            except Exception as e:
                # Fallback: try without structured output config
                logger.warning(f"⚠️ Structured output config failed, using fallback: {str(e)}")
                response = self.client.models.generate_content(
                    model=self.model_id,
                    contents=[prompt, image_part],
                    config=types.GenerateContentConfig(temperature=0.1)
                )
            
            # Parse extracted metadata
            # The new SDK response object has a .text property
            response_text = response.text
            if not response_text:
                # Some versions might return the parsed object directly if response_mime_type is set
                # but usually .text is still there.
                logger.warning("⚠️ Empty response text, checking candidates")
                if response.candidates and response.candidates[0].content.parts:
                    response_text = response.candidates[0].content.parts[0].text
            
            extracted_raw = json.loads(response_text.strip())
            
            # Normalize date
            extracted_raw['date'] = normalize_date(extracted_raw.get('date', ''))
            
            # Mask account number for PII protection
            extracted_raw['accountNumber'] = mask_account_number(extracted_raw.get('accountNumber', ''))
            
            # Compute risk score
            risk_assessment = compute_risk_score(declared_metadata, extracted_raw)
            
            # Prepare extracted metadata with masked account number
            extracted_metadata = {
                'amount': extracted_raw.get('amount', 0),
                'date': extracted_raw['date'],
                'accountNumber': extracted_raw['accountNumber'],  # Already masked
                'institution': extracted_raw.get('institution', ''),
                'confidence': extracted_raw.get('confidence', 0.0)
            }
            
            # Escalate to Notion if riskMarker == 3
            if risk_assessment['riskMarker'] == 3 and NOTION_AVAILABLE:
                try:
                    # Build diagnostic text
                    diagnostic_parts = [
                        f"Report ID: {report_id}",
                        f"Match Score: {risk_assessment['matchScore']}/100",
                        f"Risk Marker: {risk_assessment['riskMarker']} (CRITICAL)",
                        "",
                        "Mismatches:"
                    ]
                    
                    for mismatch in risk_assessment['mismatches']:
                        diagnostic_parts.append(
                            f"- {mismatch['field']}: Declared={mismatch.get('declared')}, "
                            f"Extracted={mismatch.get('extracted')}, "
                            f"Severity={mismatch.get('severity')}"
                        )
                    
                    diagnostic_text = "\n".join(diagnostic_parts)
                    
                    # Create Notion task
                    create_rpr_verify_task(
                        task_name=f"🚨 Critical Risk Dispute: {report_id}",
                        status="Backlog",
                        priority="High",
                        phase="Phase 4.2",
                        diagnostic_text=diagnostic_text
                    )
                    
                    logger.info(f"✅ Escalated risk dispute to Notion for report {report_id}")
                except Exception as e:
                    logger.error(f"❌ Failed to create Notion task: {str(e)}")
                    # Don't fail the audit if Notion fails
            
            # Write audit trail to Firestore
            db = firestore.client()
            audit_data = {
                'reportId': report_id,
                'declaredMetadata': declared_metadata,
                'extractedMetadata': extracted_metadata,
                'escalationLevel': risk_assessment['riskMarker'],
                'matchScore': risk_assessment['matchScore'],
                'riskMarker': risk_assessment['riskMarker'],
                'mismatches': risk_assessment['mismatches'],
                'driveFileId': drive_file_id,
                'auditedBy': admin_email,
                'auditedAt': firestore.SERVER_TIMESTAMP,
                'status': 'AUDITED'
            }
            
            db.collection('escalations').document(report_id).set(audit_data, merge=True)
            
            logger.info(
                f"✅ Audit complete for {report_id}. "
                f"Match Score: {risk_assessment['matchScore']}, "
                f"Risk Marker: {risk_assessment['riskMarker']}"
            )
            
            return {
                'status': 'success',
                'risk_level': risk_assessment['riskMarker'],
                'matchScore': risk_assessment['matchScore'],
                'riskMarker': risk_assessment['riskMarker'],
                'extractedMetadata': extracted_metadata,
                'mismatches': risk_assessment['mismatches']
            }
            
        except json.JSONDecodeError as e:
            logger.error(f"❌ Failed to parse JSON response from Gemini: {str(e)}")
            logger.error(f"Response text: {response.text if 'response' in locals() else 'N/A'}")
            raise RuntimeError("Forensic analysis failed: Invalid JSON response from vision model.")
        except Exception as e:
            logger.error(f"❌ Forensic analysis failed for document {drive_file_id}: {str(e)}")
            raise RuntimeError(f"Forensic analysis failed to process document: {str(e)}")
