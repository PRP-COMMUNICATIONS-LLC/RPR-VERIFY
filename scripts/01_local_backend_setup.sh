#!/bin/bash
# File: scripts/01_local_backend_setup.sh
# Description: Install Playwright and create backend files

set -e  # Exit on error

echo "🔧 PHASE 1: Local Backend Setup"
echo "================================"

# Navigate to project root
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY

# Navigate to backend
cd backend

echo "📦 Step 1.1: Install Playwright"
pip install playwright==1.40.0

echo "🌐 Step 1.2: Install Chromium browser binaries"
playwright install chromium

echo "✅ Step 1.3: Verify Playwright installation"
playwright --version

echo "📝 Step 1.4: Update requirements.txt"
cat >> requirements.txt << 'EOF'

# PDF Generation (NEW)
playwright==1.40.0
EOF

echo "📄 Step 1.5: Create pdf_generator.py"
cat > pdf_generator.py << 'EOF'
"""
PDF Generator Module using Playwright
Generates compliance-grade A4 PDFs from HTML content
"""

from playwright.sync_api import sync_playwright
import base64
from typing import Optional

class PDFGenerator:
    """
    Server-side PDF generator using Playwright/Chromium.
    Produces pixel-perfect A4 documents for compliance purposes.
    """
    
    @staticmethod
    def generate_pdf_from_html(html_content: str, output_path: Optional[str] = None) -> bytes:
        """
        Generate PDF from HTML string using Playwright.
        
        Args:
            html_content: Complete HTML string (with CSS)
            output_path: Optional file path to save PDF (for testing)
        
        Returns:
            PDF binary data (bytes)
        """
        
        with sync_playwright() as p:
            # Launch headless Chromium
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Set content
            page.set_content(html_content, wait_until='networkidle')
            
            # IMPROVEMENT: Replace fixed timeout with DOM readiness check
            # Original: page.wait_for_timeout(500)
            # Better approach for production:
            try:
                page.wait_for_selector('body', timeout=2000)
            except:
                pass  # Content loaded, proceed
            
            # Generate PDF with A4 compliance settings
            pdf_bytes = page.pdf(
                format='A4',
                print_background=True,
                margin={
                    'top': '15mm',
                    'right': '15mm',
                    'bottom': '15mm',
                    'left': '15mm'
                }
            )
            
            browser.close()
            
            # Optional: Save to file for testing
            if output_path:
                with open(output_path, 'wb') as f:
                    f.write(pdf_bytes)
                print(f"✅ PDF saved to: {output_path}")
            
            return pdf_bytes


# Test function (optional, for local verification)
if __name__ == '__main__':
    test_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <h1>Test CIS Report</h1>
        <p>This is a test document for Playwright PDF generation.</p>
    </body>
    </html>
    """
    
    generator = PDFGenerator()
    pdf_data = generator.generate_pdf_from_html(test_html, output_path='test_output.pdf')
    print(f"✅ Generated PDF: {len(pdf_data)} bytes")
EOF

echo "📄 Step 1.6: Update flask_app.py"
# We define EOF with quotes to prevent variable expansion
cat > flask_app.py << 'EOF'
"""
Flask Application - CIS Report API
Handles HTML and PDF format requests
"""

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from google.cloud import firestore
import io
import logging

# Import modules
from report_generator import ReportGenerator
from pdf_generator import PDFGenerator

# Initialize Flask
app = Flask(__name__)

# CORS Configuration
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:4200",
            "http://localhost:3000",
            "https://www.rprcomms.com",
            "https://rpr-verify.web.app"
        ]
    }
})

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Firestore client
db = firestore.Client()


def get_case_from_firestore(case_id: str):
    """Fetch case document from Firestore"""
    doc_ref = db.collection('cases').document(case_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        return None
    
    return doc.to_dict()


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200


@app.route('/api/reports/cis/<case_id>', methods=['GET'])
def get_cis_report(case_id):
    """
    CIS Report Endpoint - Supports HTML and PDF formats
    
    Query Parameters:
        format: 'html' (default) or 'pdf'
    
    Returns:
        - HTML format: JSON with summary_text (HTML string)
        - PDF format: Binary PDF file
    """
    
    try:
        # Get format parameter (default: html)
        output_format = request.args.get('format', 'html').lower()
        
        logger.info(f"📊 Generating CIS report for case: {case_id}, format: {output_format}")
        
        # Fetch case data
        case_data = get_case_from_firestore(case_id)
        
        if not case_data:
            return jsonify({
                'status': 'error',
                'message': f'Case {case_id} not found'
            }), 404
        
        # Generate report structure
        report_generator = ReportGenerator()
        report_data = report_generator.analyze_case(case_data)
        
        # Generate HTML
        html_content = report_generator.generate_human_readable(report_data)
        
        # Handle format request
        if output_format == 'pdf':
            # NEW: Server-side PDF generation
            logger.info(f"🎨 Generating PDF using Playwright...")
            
            pdf_generator = PDFGenerator()
            pdf_bytes = pdf_generator.generate_pdf_from_html(html_content)
            
            # Return PDF binary
            return send_file(
                io.BytesIO(pdf_bytes),
                mimetype='application/pdf',
                as_attachment=True,
                download_name=f'CIS_Report_{case_id}.pdf'
            )
        
        else:
            # DEFAULT: Return HTML in JSON (backward compatible)
            return jsonify({
                'status': 'success',
                'case_id': case_id,
                'summary_text': html_content,
                'sections': report_data
            }), 200
    
    except Exception as e:
        logger.error(f"❌ Error generating report: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
EOF

echo "✅ PHASE 1 COMPLETE: Backend files created"
echo ""
echo "Next: Run scripts/02_local_backend_test.sh"
