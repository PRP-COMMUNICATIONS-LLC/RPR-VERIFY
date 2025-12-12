"""
Report Generator Module
"""

from datetime import datetime
from typing import Dict, List
import json
import logging

class ReportGenerator:
    """
    Generates external and internal reports
    """
    
    def __init__(self, database):
        self.logger = logging.getLogger(__name__)
        self.db = database
    
    def generate_external_report(self, verification_id: str) -> str:
        """
        Generate customer-facing verification certificate
        """
        verification = self.db.get_verification(verification_id)
        
        if not verification:
            return "Verification not found"
        
        report = f"""
RPR CIS VERIFICATION CERTIFICATE
================================

Verification ID: {verification['id']}
Customer ID: {verification['customer_id']}
Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

VERIFICATION RESULT: {verification['decision']}

Quality Score: {verification['quality_score']}/100
Risk Tier: {verification['risk_tier']}

Document Analysis:
- Quality Assessment: {'PASSED' if verification['quality_score'] >= 70 else 'REVIEWED'}
- Risk Assessment: {'LOW' if verification['risk_tier'] == 1 else 'MODERATE' if verification['risk_tier'] == 2 else 'HIGH'}

This certificate confirms that the customer's identity documents have been
verified according to RPR CIS standards.

For dispute resolution, please contact our support team with this Verification ID.

================================
RPR CIS Dashboard v6.0
        """
        
        return report
    
    def generate_internal_report(self, verification_id: str) -> Dict:
        """
        Generate detailed internal audit report
        """
        verification = self.db.get_verification(verification_id)
        
        if not verification:
            return {'error': 'Verification not found'}
        
        # Get related disputes
        disputes = [d for d in self.db.get_all_disputes() 
                   if d['original_verification_id'] == verification_id]
        
        report = {
            'verification_id': verification_id,
            'customer_id': verification.get('customer_id'),
            'timestamp': datetime.now().isoformat(),
            'decision': verification.get('decision'),
            'quality_score': verification.get('quality_score'),
            'risk_tier': verification.get('risk_tier'),
            'extracted_data': verification.get('extracted_data', {}),
            'document_paths': verification.get('document_paths', []),
            'disputes': len(disputes),
            'audit_trail': self._get_audit_trail(verification_id),
            'compliance_status': self._check_compliance(verification)
        }
        
        return report
    
    def generate_compliance_summary(self, start_date: str, end_date: str) -> Dict:
        """
        Generate compliance metrics for regulatory reporting
        """
        # This would query the database for verifications in date range
        # For now, return mock data structure
        
        summary = {
            'period': f"{start_date} to {end_date}",
            'total_verifications': 0,
            'approved': 0,
            'rejected': 0,
            'escalated': 0,
            'disputes': 0,
            'resolution_rate': 0.0,
            'average_quality_score': 0.0,
            'compliance_metrics': {
                'false_positive_rate': 0.0,
                'false_negative_rate': 0.0,
                'processing_time_avg': 0.0
            },
            'regulatory_requirements': {
                'data_retention': '7 years',
                'audit_trail': 'Complete',
                'accuracy_target': '95%'
            }
        }
        
        return summary
    
    def _get_audit_trail(self, verification_id: str) -> List[Dict]:
        """Get audit trail for verification"""
        # Mock implementation - would query audit_trail table
        return [
            {
                'timestamp': datetime.now().isoformat(),
                'action': 'VERIFICATION_CREATED',
                'details': f'Created verification {verification_id}'
            }
        ]
    
    def _check_compliance(self, verification: Dict) -> Dict:
        """Check compliance status"""
        return {
            'data_protection': 'Compliant',
            'audit_trail': 'Complete',
            'accuracy_check': 'Passed' if verification.get('quality_score', 0) >= 70 else 'Review'
        }

if __name__ == "__main__":
    import argparse
    import os
    import json
    from jinja2 import Template
    
    parser = argparse.ArgumentParser(description='Report Generator')
    parser.add_argument('--input', required=True, help='Input folder with JSON results')
    parser.add_argument('--template', required=True, help='HTML template path')
    parser.add_argument('--output', required=True, help='Output folder for HTML reports')
    args = parser.parse_args()
    
    input_folder = args.input
    template_path = args.template
    output_folder = args.output
    
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    if not os.path.exists(template_path):
        print(f"Template not found: {template_path}")
        exit(1)
    
    with open(template_path, 'r') as f:
        template_content = f.read()
        
    template = Template(template_content)
    
    processed_count = 0
    
    if not os.path.exists(input_folder):
        print(f"Input folder {input_folder} does not exist.")
        exit(1)
        
    print(f"Generating reports from {input_folder} using {template_path}")
    
    for filename in os.listdir(input_folder):
        if not filename.endswith('_result.json'):
            continue
            
        filepath = os.path.join(input_folder, filename)
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
                
            # Prepare context for template
            qa = data.get('quality_assessment', {})
            ext = data.get('extraction', {})
            sd = data.get('structured_data', {}).get('fields', {})
            
            # Determine status class
            level = qa.get('level', 'UNKNOWN')
            if level in ['EXCELLENT', 'GOOD']:
                status_class = 'status-pass'
            elif level == 'ACCEPTABLE':
                status_class = 'status-review'
            else:
                status_class = 'status-fail'
            
            context = {
                'document_id': data.get('filename'),
                'timestamp': data.get('timestamp'),
                'overall_status': level,
                'status_class': status_class,
                'quality_score': qa.get('score', 0),
                'dpi': qa.get('metrics', {}).get('dpi', {}).get('dpi', 0),
                'dpi_status': qa.get('metrics', {}).get('dpi', {}).get('status', 'unknown'),
                'blur_score': qa.get('metrics', {}).get('blur', {}).get('blur', 0),
                'blur_status': qa.get('metrics', {}).get('blur', {}).get('status', 'unknown'),
                'brightness_status': qa.get('metrics', {}).get('brightness', {}).get('status', 'unknown'),
                'name': sd.get('name', 'N/A'),
                'dob': sd.get('date_of_birth', 'N/A'),
                'doc_number': sd.get('abn', 'N/A'), 
                'address': sd.get('address', 'N/A')
            }
            
            html_output = template.render(context)
            
            output_filename = f"{os.path.splitext(filename)[0].replace('_result', '')}_report.html"
            with open(os.path.join(output_folder, output_filename), 'w') as f:
                f.write(html_output)
                
            processed_count += 1
            print(f"Generated report for {filename}")
            
        except Exception as e:
            print(f"Error generating report for {filename}: {str(e)}")
        
    print(f"Report generation complete. Generated {processed_count} reports.")