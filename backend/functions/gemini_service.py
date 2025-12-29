import json
import vertexai
from vertexai.generative_models import GenerativeModel, Part

class GeminiService:
    """Centralized Vision & Reasoning for RPR-VERIFY Phase 4."""
    
    def __init__(self, project_id="rpr-verify-b", location="asia-southeast1"):
        vertexai.init(project=project_id, location=location)
        self.model = GenerativeModel("gemini-1.5-flash")

    def extract_financial_metadata(self, document_bytes: bytes, mime_type: str):
        """Used by Tab 1: INFORMATION for KYC/AML extraction."""
        prompt = """
        Extract: amount, date, accountNumber, institution, and ABN.
        Requirements: Mask account numbers (e.g., ****-1234).
        Return ONLY valid JSON.
        """
        doc_part = Part.from_data(data=document_bytes, mime_type=mime_type)
        response = self.model.generate_content([prompt, doc_part])
        return json.loads(response.text.strip('`').replace('json', ''))

    def score_case_risk(self, case_details: dict):
        """Used by Tab 4: RESOLUTION to determine Priority Levels (0-3)."""
        prompt = f"Analyze this dispute and return a JSON riskMarker (0-3) and priority: {json.dumps(case_details)}"
        response = self.model.generate_content(prompt)
        return json.loads(response.text.strip('`').replace('json', ''))
