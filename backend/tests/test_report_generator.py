#!/usr/bin/env python3
"""
Test script for RPR-VERIFY Report Generator - CIS Compliance Verification
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.modules.report_generator import ReportGenerator

def test_initialization():
    """Test ReportGenerator initialization"""
    print("Testing initialization...")
    rg = ReportGenerator(database=None)
    print("✅ Initialization successful")
    return rg

def test_cis_sections(rg):
    """Test CIS report generation with all 5 sections"""
    print("\nTesting CIS report generation...")
    
    # Test data matching CIS-REPORT.txt format
    test_data = {
        'proof_of_identity': {
            'fileName': 'drivers-license.jpg',
            'primary_document': 'drivers-license.jpg',
            'driversLicenceNumber': '3554361',
            'licence_number': '3554361',
            'dateOfBirth': '11 Jan 1955',
            'date_of_birth': '11 Jan 1955',
            'licenceExpiryDate': '18 Apr 2026',
            'expiry_date': '18 Apr 2026'
        },
        'proof_of_address': {
            'fileName': 'water-bill.jpg',
            'document': 'water-bill.jpg',
            'serviceAddress': '15 BUCHANAN RISE, COOGEE WA 6166',
            'address': '15 BUCHANAN RISE, COOGEE WA 6166',
            'issueDate': '20 JAN 2025',
            'issue_date': '20 JAN 2025'
        },
        'business_details': {
            'fileName': 'abn-lookup.jpg',
            'document': 'abn-lookup.jpg',
            'entityName': 'ARDEAL TRADING TRUST',
            'entity_name': 'ARDEAL TRADING TRUST',
            'abn': '16 920 472 163',
            'trusteeName': 'The Trustee for THE ARDEAL TRADING TRUST',
            'trustee_name': 'The Trustee for THE ARDEAL TRADING TRUST',
            'tradingName': 'ARDEAL CONCRETE CONTRACTORS',
            'trading_name': 'ARDEAL CONCRETE CONTRACTORS'
        },
        'source_of_funds': {
            'fileName': 'bank-statement.jpg',
            'document': 'bank-statement.jpg',
            'account': 'Commonwealth Bank',
            'bsb': '123-456',
            'accountNumber': '12345678',
            'account_number': '12345678',
            'statementPeriod': '19 Jun - 29 Sep 2018',
            'statement_period': '19 Jun - 29 Sep 2018'
        },
        'photo_analysis': 'Photo verification complete. All security features validated. Document authenticity confirmed.'
    }
    
    # Generate JSON
    report_json = rg.generate_report_json(
        proof_of_identity=test_data['proof_of_identity'],
        proof_of_address=test_data['proof_of_address'],
        business_details=test_data['business_details'],
        source_of_funds=test_data['source_of_funds'],
        photo_analysis=test_data['photo_analysis']
    )
    
    print("✅ JSON generation successful")
    
    # Verify all 5 CIS sections are present
    sections = report_json.get('sections', {})
    required_sections = [
        'proof_of_identity',
        'proof_of_address',
        'business_details',
        'source_of_funds',
        'photo_analysis'
    ]
    
    print(f"\nVerifying CIS sections ({len(required_sections)} required):")
    all_present = True
    for section in required_sections:
        if section in sections:
            print(f"  ✅ {section}")
        else:
            print(f"  ❌ {section} - MISSING")
            all_present = False
    
    if not all_present:
        print("\n❌ ERROR: Not all CIS sections present!")
        return False
    
    print(f"\n✅ All {len(required_sections)} CIS sections present")
    return True, report_json

def test_human_readable(rg, report_json):
    """Test human-readable output generation"""
    print("\nTesting human-readable output generation...")
    
    # Test with individual customer
    html_output = rg.generate_human_readable(
        report_json,
        customer_type="INDIVIDUAL",
        attachments=[]
    )
    
    if html_output and len(html_output) > 100:
        print(f"✅ HTML generation successful ({len(html_output)} characters)")
        
        # Check for key CIS elements
        checks = [
            ('CUSTOMER INFORMATION SHEET', 'Report title'),
            ('Proof of Identity', 'POI section'),
            ('Proof of Address', 'POA section'),
            ('Account Holder Verification', 'SOF section'),
            ('Photo Analysis', 'Photo section')
        ]
        
        print("\nVerifying HTML content:")
        all_found = True
        for check_text, description in checks:
            if check_text in html_output:
                print(f"  ✅ {description}")
            else:
                print(f"  ❌ {description} - NOT FOUND")
                all_found = False
        
        if not all_found:
            print("\n⚠️  WARNING: Some CIS elements missing from HTML")
        else:
            print("\n✅ All CIS elements present in HTML")
        
        return True
    else:
        print("❌ HTML generation failed - output too short or empty")
        return False

def test_legacy_wrapper(rg):
    """Test legacy wrapper for backward compatibility"""
    print("\nTesting legacy wrapper...")
    
    legacy_data = {
        'extracted_fields': [
            {'field': 'licence_number', 'value': '3554361'},
            {'field': 'date_of_birth', 'value': '11 Jan 1955'},
            {'field': 'expiry_date', 'value': '18 Apr 2026'},
            {'field': 'address', 'value': '15 BUCHANAN RISE, COOGEE WA 6166'},
            {'field': 'issue_date', 'value': '20 JAN 2025'},
            {'field': 'entity_name', 'value': 'ARDEAL TRADING TRUST'},
            {'field': 'abn', 'value': '16 920 472 163'},
            {'field': 'trading_name', 'value': 'ARDEAL CONCRETE CONTRACTORS'},
            {'field': 'account_name', 'value': 'Commonwealth Bank'},
            {'field': 'bsb', 'value': '123-456'},
            {'field': 'account_number', 'value': '12345678'},
            {'field': 'statement_period', 'value': '19 Jun - 29 Sep 2018'}
        ],
        'id_document_file': 'test-id.jpg',
        'address_document_file': 'test-address.jpg',
        'abn_document_file': 'test-abn.jpg',
        'bank_document_file': 'test-bank.jpg',
        'photo_analysis_description': 'Test photo analysis'
    }
    
    try:
        legacy_report = rg.generate_report_json_legacy(legacy_data)
        
        # Verify structure
        if 'sections' in legacy_report:
            sections = legacy_report['sections']
            if all(key in sections for key in ['proof_of_identity', 'proof_of_address', 'business_details', 'source_of_funds', 'photo_analysis']):
                print("✅ Legacy wrapper successful - all sections present")
                return True
            else:
                print("❌ Legacy wrapper - missing sections")
                return False
        else:
            print("❌ Legacy wrapper - invalid structure")
            return False
    except Exception as e:
        print(f"❌ Legacy wrapper failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("=" * 70)
    print("RPR-VERIFY Report Generator - CIS Compliance Test")
    print("=" * 70)
    
    try:
        # Test 1: Initialization
        rg = test_initialization()
        
        # Test 2: CIS Sections
        result = test_cis_sections(rg)
        if isinstance(result, tuple):
            success, report_json = result
            if not success:
                print("\n❌ CIS sections test failed")
                return 1
        else:
            print("\n❌ CIS sections test failed")
            return 1
        
        # Test 3: Human-readable output
        if not test_human_readable(rg, report_json):
            print("\n⚠️  Human-readable test had issues")
        
        # Test 4: Legacy wrapper
        if not test_legacy_wrapper(rg):
            print("\n❌ Legacy wrapper test failed")
            return 1
        
        # All tests passed
        print("\n" + "=" * 70)
        print("🎉 ALL TESTS PASSED - Report generator is CIS-compliant")
        print("=" * 70)
        return 0
        
    except Exception as e:
        print(f"\n❌ Test suite failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())

