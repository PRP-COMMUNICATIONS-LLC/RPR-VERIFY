
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json
import os
import time
from dateutil.parser import parse

# --- Configuration ---
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "rpr-verify-b")
LOCATION = os.environ.get("GOOGLE_CLOUD_REGION", "asia-southeast1")
MODEL_ID = "gemini-1.5-flash-001"
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 5

# --- Custom Error Hierarchy ---
class VisionEngineError(Exception):
    """Base exception for the Vision Engine."""
    pass

class TransientApiError(VisionEngineError):
    """Raised for temporary API issues that might be resolved on retry."""
    pass

class FatalApiError(VisionEngineError):
    """Raised for permanent API errors that should not be retried."""
    pass

class DataParsingError(VisionEngineError):
    """Raised when the API response is not in the expected format."""
    pass

# --- Helper Functions ---
def normalize_date(date_string: str) -> str:
    """Parses a date string and returns it in ISO 8601 format (YYYY-MM-DD)."""
    if not date_string:
        return ""
    try:
        return parse(date_string).strftime('%Y-%m-%d')
    except (ValueError, TypeError):
        return date_string

def mask_account_number(account_number: str) -> str:
    """Masks an account number, showing only the last 4 digits."""
    if not isinstance(account_number, str):
        return ""
    length = len(account_number)
    if length == 0:
        return ""
    if length <= 4:
        return "*" * length
    return f"****-{account_number[-4:]}"

def compute_risk_score(declared_metadata: dict, extracted_metadata: dict) -> dict:
    """
    Computes a risk score based on the variance between declared and extracted data.
    """
    score = 100.0
    risk_marker = 0
    mismatches = []

    declared_amount = float(declared_metadata.get('amount', 0))
    extracted_amount = float(extracted_metadata.get('amount', 0))
    if declared_amount > 0:
        variance = abs(declared_amount - extracted_amount) / declared_amount
        if variance > 0.05:
            score -= 50
            risk_marker = 3
            mismatches.append("CRITICAL_DISCREPANCY")
        elif variance > 0.01:
            score -= 25
            risk_marker = 2
            mismatches.append("MEDIUM_DISCREPANCY")

    declared_date = normalize_date(declared_metadata.get('date', ''))
    extracted_date = normalize_date(extracted_metadata.get('date', ''))
    if declared_date != extracted_date:
        score -= 10
        mismatches.append("DATE_MISMATCH")

    declared_inst = declared_metadata.get('institution', '').lower()
    extracted_inst = extracted_metadata.get('institution', '').lower()
    if declared_inst not in extracted_inst and extracted_inst not in declared_inst:
        score -= 15
        mismatches.append("INSTITUTION_MISMATCH")

    return {
        "matchScore": max(0, score),
        "riskMarker": risk_marker,
        "mismatches": mismatches
    }

class VisionAuditEngine:
    def __init__(self):
        try:
            vertexai.init(project=PROJECT_ID, location=LOCATION)
            self.model = GenerativeModel(MODEL_ID)
            print(f"✅ VisionAuditEngine Initialized: {MODEL_ID} @ {LOCATION}")
        except Exception as e:
            print(f"⚠️ VisionAuditEngine Init Failed: {e}")
            self.model = None

    def audit_slip(self, drive_file_id: str, file_bytes: bytes, declared_metadata: dict, report_id: str, admin_email: str) -> dict:
        """
        Audits a bank slip by extracting data, computing risk, and returning a full report.
        """
        if not self.model:
            raise FatalApiError("Vision Audit Engine not initialized")

        # 1. Forensic Extraction
        extracted_data = self._extract_forensic_data(file_bytes, declared_metadata)

        # 2. Risk Computation
        risk_analysis = compute_risk_score(declared_metadata, extracted_data)

        # 3. PII Masking
        extracted_data['accountNumber'] = mask_account_number(extracted_data.get('accountNumber', ''))

        # 4. Echo Metadata and assemble final report
        return {
            "success": True,
            "status": "Audit Complete",
            "driveFileId": drive_file_id,
            "reportId": report_id,
            "adminEmail": admin_email,
            "declaredMetadata": declared_metadata,
            "extractedMetadata": extracted_data,
            **risk_analysis
        }

    def _extract_forensic_data(self, file_bytes: bytes, forensic_metadata: dict) -> dict:
        """
        Calls the Gemini API to extract data from the image, with retry logic.
        """
        image_part = Part.from_data(file_bytes, mime_type="image/jpeg")
        prompt = self._build_prompt(forensic_metadata)

        for attempt in range(MAX_RETRIES):
            try:
                response = self.model.generate_content(
                    [image_part, prompt],
                    generation_config={"response_mime_type": "application/json"}
                )
                text = response.text.strip().replace("```json", "").replace("```", "")
                return json.loads(text)
            except json.JSONDecodeError as e:
                raise DataParsingError(f"Failed to parse JSON on attempt {attempt + 1}: {e}")
            except Exception as e:
                if "503" in str(e) or "server" in str(e).lower():
                    print(f"⚠️ Transient API error (attempt {attempt + 1}/{MAX_RETRIES}): {e}")
                    if attempt + 1 == MAX_RETRIES:
                        raise TransientApiError(f"API failed after {MAX_RETRIES} retries.")
                    time.sleep(RETRY_DELAY_SECONDS * (attempt + 1))
                else:
                    raise FatalApiError(f"A non-retryable API error occurred: {e}")

        raise FatalApiError("Exhausted all retry attempts without success.")

    def _build_prompt(self, forensic_metadata: dict) -> str:
        return f"""
        Forensic Context:
        - Case ID: {forensic_metadata.get('caseId', 'N/A')}
        - Analyst ID: {forensic_metadata.get('analystId', 'N/A')}

        You are a forensic auditor. Extract the following from the bank slip:
        1. Amount (number only)
        2. Transaction Date (ISO 8601 YYYY-MM-DD)
        3. Recipient Account Number (digits only)
        4. Institution Name (Bank)
        5. Reference ID (if visible)

        Return ONLY valid JSON.
        Schema: {{"amount": float, "date": "string", "accountNumber": "string", "institution": "string", "referenceId": "string"}}
        """

# Singleton Instance
vision_service = VisionAuditEngine()
