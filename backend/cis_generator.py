import base64
import hashlib
import io
import os
from datetime import datetime, timedelta
from pathlib import Path
from google.cloud import storage
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from firebase_admin import firestore
import google.auth

class CISReportGenerator:
    def __init__(self):
        self.db = firestore.client()
        self.storage_client = storage.Client()
        creds, _ = google.auth.default(scopes=['https://www.googleapis.com/auth/drive'])
        self.drive_service = build('drive', 'v3', credentials=creds)
        self.templates_dir = Path(__file__).parent / "templates"

    def generate_cis_html(self, report_id, report_type, admin_email):
        audit_doc = self.db.collection('escalations').document(report_id).get()
        if not audit_doc.exists:
            raise ValueError("Report ID not found in database.")
        
        audit_data = audit_doc.to_dict()
        template_file = self.templates_dir / f"CIS-{report_type}-TEMPLATE.html"
        
        if not template_file.exists():
            raise FileNotFoundError(f"Template not found: {template_file}")

        with open(template_file, 'r') as f:
            template = f.read()

        # Resolve parent folder from File ID to gather all supporting docs
        file_metadata = self.drive_service.files().get(
            fileId=audit_data['driveFileId'], fields='parents'
        ).execute()
        parent_folder_id = file_metadata['parents'][0]
        
        images = self._fetch_drive_images(parent_folder_id)
        
        doc_html = ""
        for img in images:
            img_b64 = base64.b64encode(img['bytes']).decode('utf-8')
            img_hash = hashlib.sha256(img['bytes']).hexdigest()
            doc_html += f"""
            <div class="supporting-doc">
                <h3>{img['name']}</h3>
                <img src="data:image/jpeg;base64,{img_b64}" />
                <div class="doc-meta">SHA-256: {img_hash}</div>
            </div>"""

        vars = self._map_vars(audit_data, report_type, admin_email)
        html_content = template
        for key, val in vars.items():
            html_content = html_content.replace(f"{{{{{key}}}}}", str(val))
        
        html_content = html_content.replace("{{SUPPORTING_DOCUMENTS_LOOP}}", doc_html)
        
        # Upload to GCS and generate Signed URL
        bucket_name = 'rpr-verify-b-reports'
        blob_name = f"CIS-{report_id}.html"
        bucket = self.storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.upload_from_string(html_content, content_type='text/html')
        
        # Signed URL for secure frontend access without public exposure
        report_url = blob.generate_signed_url(version='v4', expiration=timedelta(hours=24), method='GET')
        report_hash = "sha256:" + hashlib.sha256(html_content.encode()).hexdigest()

        self.db.collection('escalations').document(report_id).update({
            'cisReportUrl': report_url,
            'cisReportHash': report_hash,
            'cisGeneratedAt': datetime.utcnow().isoformat() + "Z",
            'cisGeneratedBy': admin_email,
            'status': 'REPORT_GENERATED'
        })

        return {'status': 'success', 'report_url': report_url, 'hash': report_hash}

    def _map_vars(self, data, rtype, admin):
        ext = data.get('extractedMetadata', {})
        dec = data.get('declaredMetadata', {})
        lvl = data.get('escalationLevel', 0)
        
        status_map = {0:('VERIFIED','verified'), 1:('REVIEW','pending'), 2:('DISCREPANCY','flagged')}
        s_text, s_class = status_map.get(lvl, ('UNKNOWN', 'pending'))

        return {
            'REPORT_ID': data.get('reportId', 'N/A'),
            'CUSTOMER_NAME': dec.get('accountName', 'N/A'),
            'REPORT_DATE': datetime.utcnow().strftime('%d/%m/%Y %H:%M UTC'),
            'PREPARED_BY': admin,
            'SOF_DOC': 'Bank Statement',
            'SOF_ACCOUNT_NAME': dec.get('accountName', 'N/A'),
            'SOF_BSB': ext.get('bsb', 'N/A'),
            'SOF_ACCOUNT_NUM': '****' + str(dec.get('accountNumber', ''))[-4:],
            'SOF_PERIOD': dec.get('date', 'N/A'),
            'SOF_STATUS': s_text,
            'SOF_STATUS_CLASS': s_class,
            'SIGNATURE_HASH': data.get('cisReportHash', 'Pending')[:16] if data.get('cisReportHash') else 'Pending',
            'POI_DOC': 'Australian Driver License', 'POI_LICENCE': 'REDACTED', 'POI_DOB': 'REDACTED', 'POI_EXPIRY': 'REDACTED', 'POI_STATUS': 'PENDING', 'POI_STATUS_CLASS': 'pending',
            'POA_DOC': 'Utility Bill', 'POA_ADDRESS': 'REDACTED', 'POA_ISSUE': 'REDACTED', 'POA_STATUS': 'PENDING', 'POA_STATUS_CLASS': 'pending',
            'ABN_DOC': 'ABN Lookup', 'ABN_ENTITY_NAME': 'REDACTED', 'ABN_NUMBER': 'REDACTED', 'ABN_TRUSTEE': 'N/A', 'ABN_TRADING_NAME': 'N/A', 'ABN_STATUS': 'PENDING', 'ABN_STATUS_CLASS': 'pending'
        }

    def _fetch_drive_images(self, folder_id):
        results = self.drive_service.files().list(
            q=f"'{folder_id}' in parents and mimeType contains 'image/'",
            fields="files(id, name)"
        ).execute()
        files = []
        for f in results.get('files', []):
            req = self.drive_service.files().get_media(fileId=f['id'])
            buf = io.BytesIO()
            downloader = MediaIoBaseDownload(buf, req)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            buf.seek(0)
            files.append({'name': f['name'], 'bytes': buf.read()})
        return files
