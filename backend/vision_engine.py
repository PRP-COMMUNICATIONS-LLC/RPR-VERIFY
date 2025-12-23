import vertexai
from vertexai.generative_models import GenerativeModel, Part, SafetySetting
import json
import os

# CONFIGURATION
# Default to Singapore (asia-southeast1) for RPR sovereignty
PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "rpr-verify-b")
LOCATION = os.environ.get("GOOGLE_CLOUD_REGION", "asia-southeast1")
MODEL_ID = "gemini-1.5-flash-001" 

class VisionEngine:
    def __init__(self):
        try:
            vertexai.init(project=PROJECT_ID, location=LOCATION)
            self.model = GenerativeModel(MODEL_ID)
            print(f"✅ VisionEngine Initialized: {MODEL_ID} @ {LOCATION}")
        except Exception as e:
            print(f"⚠️ VisionEngine Init Failed: {e}")
            self.model = None

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

            # Strict generation config for JSON
            response = self.model.generate_content(
                [image_part, prompt],
                generation_config={"response_mime_type": "application/json"}
            )
            
            # Clean and parse response
            text = response.text.strip()
            # Remove potential markdown code blocks if the model ignores the instruction
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            
            extracted_data = json.loads(text)
            
            # Return in expected format with success flag
            return {
                "success": True,
                "status": "success",
                "extractedMetadata": extracted_data,
                "risk_level": 0,  # Default, can be computed based on mismatches
                "matchScore": 100.0,  # Default, can be computed
                "riskMarker": 0  # Default, can be computed
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
