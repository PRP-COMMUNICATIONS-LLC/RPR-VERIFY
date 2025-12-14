"""
PDF Generator Module using Playwright
Generates compliance-grade A4 PDFs from HTML content
FIXED: macOS sandbox compatibility
"""

from playwright.sync_api import sync_playwright
from typing import Optional
import logging
import base64

logger = logging.getLogger(__name__)

class PDFGenerator:
    """
    Server-side PDF generator using Playwright/Chromium.
    Produces pixel-perfect A4 documents for compliance purposes.
    """
    
    @staticmethod
    def generate_pdf_from_html(
        html_content: str, 
        output_path: Optional[str] = None,
        return_base64: bool = False,
        case_id: Optional[str] = None
    ) -> bytes:
        """
        Generate PDF from HTML string using Playwright.
        
        Args:
            html_content: Complete HTML string (with CSS)
            output_path: Optional file path to save PDF (for testing)
            return_base64: If True, return base64-encoded string instead of bytes
            case_id: Optional case ID for logging
        
        Returns:
            PDF binary data (bytes) or base64 string
        """
        
        log_prefix = f"[{case_id}]" if case_id else ""
        logger.info(f"{log_prefix} Starting PDF generation")
        
        try:
            with sync_playwright() as p:
                # Launch headless Chromium with macOS sandbox fix
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        '--disable-blink-features=AutomationControlled',
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage'
                    ]
                )
                
                page = browser.new_page()
                
                # Set content
                logger.info(f"{log_prefix} Setting HTML content")
                page.set_content(html_content, wait_until='domcontentloaded')
                
                # Wait for body to ensure DOM is ready
                try:
                    page.wait_for_selector('body', timeout=2000)
                except:
                    logger.warning(f"{log_prefix} Body selector timeout, proceeding anyway")
                
                # Generate PDF with A4 compliance settings
                logger.info(f"{log_prefix} Generating PDF")
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
                logger.info(f"{log_prefix} PDF generated successfully ({len(pdf_bytes)} bytes)")
                
                # Optional: Save to file for testing
                if output_path:
                    with open(output_path, 'wb') as f:
                        f.write(pdf_bytes)
                    logger.info(f"{log_prefix} PDF saved to: {output_path}")
                
                # Return base64 if requested
                if return_base64:
                    return base64.b64encode(pdf_bytes).decode('utf-8')
                
                return pdf_bytes
        
        except Exception as e:
            logger.error(f"{log_prefix} PDF generation failed: {str(e)}")
            raise


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
    pdf_data = generator.generate_pdf_from_html(
        test_html, 
        output_path='test_output.pdf',
        case_id='TEST'
    )
    print(f"✅ Generated PDF: {len(pdf_data)} bytes")
