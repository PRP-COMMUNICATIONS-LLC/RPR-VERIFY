import json
import logging
import google.generativeai as genai
from google.cloud import secretmanager
from firebase_admin import firestore
import datetime

logger = logging.getLogger(__name__)

class VisionAuditEngine:
    def __init__(self):
        """Initialize the Vision Audit Engine with Gemini API key from Secret Manager."""
        try:
            api_key = self._get_secret('gemini-api-key')
            genai.configure(api_key=api_key)
            # Using gemini-1.5-flash as the intended 'Gemini 2.5 Flash' high-performance model
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            logger.info("✅ VisionAuditEngine initialized with Gemini 1.5 Flash")
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

    def audit_slip(self, drive_file_id, file_bytes, declared_metadata, report_id, admin_email):
        """
        Forensic audit of a bank slip using Gemini Vision.
        
        Args:
            drive_file_id (str): ID of the file in Google Drive
            file_bytes (bytes): Raw file content
            declared_metadata (dict): Metadata declared by the user (amount, etc.)
            report_id (str): ID of the report in Firestore
            admin_email (str): Email of the admin performing the audit
        """
        try:
            prompt = (
                "Extract the following metadata from this bank slip as JSON: "
                "{'amount': float, 'date': string, 'account_number': string, 'institution': string, 'confidence': float}. "
                "Only return the JSON object."
            )
            
            # Prepare image for Gemini
            image_parts = [
                {
                    "mime_type": "image/jpeg", # Assuming JPEG, should be dynamic if possible
                    "data": file_bytes
                }
            ]
            
            response = self.model.generate_content(
                [prompt, image_parts[0]],
                request_options={'timeout': 30}
            )
            
            extracted = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
            
            # Compute risk: 1% threshold for escalation Level 2
            declared_amount = float(declared_metadata.get('amount', 0))
            extracted_amount = float(extracted.get('amount', 0))
            amount_diff = abs(extracted_amount - declared_amount)
            
            risk_level = 0
            if declared_amount > 0 and amount_diff > (declared_amount * 0.01):
                risk_level = 2
            
            # Write audit trail to Firestore
            db = firestore.client()
            audit_data = {
                'reportId': report_id,
                'declaredMetadata': declared_metadata,
                'extractedMetadata': extracted,
                'escalationLevel': risk_level,
                'driveFileId': drive_file_id,
                'auditedBy': admin_email,
                'auditedAt': firestore.SERVER_TIMESTAMP,
                'status': 'AUDITED'
            }
            
            db.collection('escalations').document(report_id).set(audit_data, merge=True)
            
            logger.info(f"✅ Audit complete for {report_id}. Risk Level: {risk_level}")
            return {'status': 'success', 'risk_level': risk_level}
            
        except Exception as e:
            logger.error(f"❌ Forensic analysis failed for document {drive_file_id}: {str(e)}")
            raise RuntimeError("Forensic analysis failed to process document.")
