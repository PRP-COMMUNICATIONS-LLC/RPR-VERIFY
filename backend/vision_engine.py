import vertexai
from vertexai.generative_models import GenerativeModel, Part, SafetySetting
import json
import os

# CONFIGURATION
# Default to Singapore (asia-southeast1) for RPR sovereignty
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "rpr-verify-b")
LOCATION = os.environ.get("GOOGLE_CLOUD_REGION", "asia-southeast1")
MODEL_ID = "gemini-1.5-flash-001"
FORENSIC_THRESHOLD = 0.011  # 1.1% Threshold for alerts

# Forensic Marker Lock-In for Gavril Vasile Pop case
FORENSIC_SCHEMA = {
    "bank_name": "NAB",
    "bsb": "086-217",
    "account": "7192",
    "owner_pattern": "ARDEAL|POP"
}

def validate_real_case(extracted_data):
    if extracted_data.get('bsb') != FORENSIC_SCHEMA['bsb']:
        return "🔴 RED ALERT: BSB Mismatch"
    if not any(x in extracted_data.get('owner', '') for x in ["ARDEAL", "POP"]):
        return "🔴 RED ALERT: Identity Mismatch"
    return "✅ VERIFIED: Real Case Aligned"

class VisionEngine:
    def __init__(self):
        try:
            vertexai.init(project=PROJECT_ID, location=LOCATION)
            self.model = GenerativeModel(MODEL_ID)
            print(f"✅ VisionEngine Initialized: {MODEL_ID} @ {LOCATION}")
        except Exception as e:
            print(f"⚠️ VisionEngine Init Failed: {e}")
            self.model = None

    def analyze_forensic_markers(self, extracted_data, expected_data):
        """
        Compares extracted data against expected data to generate a risk score.
        """
        mismatches = 0
        total_fields = len(expected_data)

        for key, expected_value in expected_data.items():
            if str(extracted_data.get(key)) != str(expected_value):
                mismatches += 1

        risk_score = (mismatches / total_fields) if total_fields > 0 else 0

        if risk_score > FORENSIC_THRESHOLD:
            status = "🔴 URGENT AUDIT"
        else:
            status = "✅ VERIFIED"

        return {
            "risk_score": risk_score,
            "mismatches": mismatches,
            "status": status
        }

    def scan_slip(self, file_bytes, mime_type, forensic_metadata=None, expected_data=None):
        """
        Analyzes a bank slip image/PDF to extract forensic metadata.
        """
        if not self.model:
            return {"error": "Vision Engine not initialized", "success": False}

        try:
            image_part = Part.from_data(file_bytes, mime_type=mime_type)
            
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
            4. BSB (digits and dashes only)
            5. Owner name (if visible)
            
            Return ONLY valid JSON. No markdown formatting.
            Schema:
            {{
                "amount": float,
                "date": "string",
                "accountNumber": "string",
                "bsb": "string",
                "owner": "string"
            }}
            """

            response = self.model.generate_content(
                [image_part, prompt],
                generation_config={"response_mime_type": "application/json"}
            )
            
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            
            extracted_data = json.loads(text)
            
            # Perform real case validation
            validation_status = validate_real_case(extracted_data)

            forensic_analysis = {}
            if expected_data:
                forensic_analysis = self.analyze_forensic_markers(extracted_data, expected_data)

            return {
                "success": True,
                "status": validation_status,
                "extractedMetadata": extracted_data,
                **forensic_analysis
            }

        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {e}")
            return {
                "success": False,
                "error": "Failed to parse Vision Engine response",
                "details": str(e)
            }
        except Exception as e:
            print(f"❌ VISION SCAN ERROR: {e}")
            return {
                "success": False,
                "error": "Forensic extraction failed",
                "details": str(e)
            }

# Singleton Instance
vision_service = VisionEngine()