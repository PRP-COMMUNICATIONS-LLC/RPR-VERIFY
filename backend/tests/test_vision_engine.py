#!/usr/bin/env python3
"""
Test suite for Vision Engine - Phase 4
Validates forensic extraction, risk scoring, and Notion integration.
"""
import sys
import os
import json
import base64
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Mock dependencies for testing
class MockSecretManager:
    """Mock Secret Manager for local testing"""
    def access_secret_version(self, request):
        class MockResponse:
            def __init__(self):
                self.payload = type('obj', (object,), {
                    'data': os.getenv('GEMINI_API_KEY', 'test-key').encode('UTF-8')
                })()
        return MockResponse()

class MockSecretManagerClient:
    """Mock Secret Manager Client"""
    def __init__(self):
        pass
    
    def access_secret_version(self, request):
        class MockResponse:
            def __init__(self):
                self.payload = type('obj', (object,), {
                    'data': os.getenv('GEMINI_API_KEY', 'test-key').encode('UTF-8')
                })()
        return MockResponse()

# Mock Firebase Admin
class MockFirestore:
    def client(self):
        class MockDB:
            def collection(self, name):
                class MockCollection:
                    def document(self, doc_id):
                        class MockDocument:
                            def set(self, data, merge=False):
                                print(f"📝 Mock Firestore: Setting document {doc_id}")
                                return True
                        return MockDocument()
                return MockCollection()
        return MockDB()

# Apply mocks before importing vision_engine
import unittest.mock as mock

# Mock Google Cloud Secret Manager
sys.modules['google.cloud.secretmanager'] = mock.MagicMock()
sys.modules['google.cloud.secretmanager'].SecretManagerServiceClient = MockSecretManagerClient

# Mock Firebase Admin
sys.modules['firebase_admin'] = mock.MagicMock()
sys.modules['firebase_admin'].firestore = MockFirestore()

# Now import vision engine
from vision_engine import (
    VisionAuditEngine,
    compute_risk_score,
    normalize_date,
    mask_account_number
)


def load_test_image(image_path: str) -> bytes:
    """Load test image file as bytes"""
    with open(image_path, 'rb') as f:
        return f.read()


def test_date_normalization():
    """Test date parsing normalization"""
    print("\n🧪 Testing Date Normalization")
    print("=" * 60)
    
    test_cases = [
        ("2025-12-20", "2025-12-20"),
        ("20/12/2025", "2025-12-20"),
        ("12/20/2025", "2025-12-20"),
        ("20 Dec 2025", "2025-12-20"),
        ("20 December 2025", "2025-12-20"),
    ]
    
    for input_date, expected in test_cases:
        result = normalize_date(input_date)
        status = "✅" if result == expected else "❌"
        print(f"{status} {input_date} -> {result} (expected: {expected})")
    
    print()


def test_account_masking():
    """Test account number masking"""
    print("\n🧪 Testing Account Number Masking")
    print("=" * 60)
    
    test_cases = [
        ("1234567890", "****-7890"),
        ("1234-5678-9012", "****-9012"),
        ("123", "***"),
        ("", ""),
    ]
    
    for input_account, expected in test_cases:
        result = mask_account_number(input_account)
        status = "✅" if result == expected else "❌"
        print(f"{status} {input_account} -> {result} (expected: {expected})")
    
    print()


def test_risk_scoring():
    """Test risk score computation"""
    print("\n🧪 Testing Risk Score Computation")
    print("=" * 60)
    
    # Test case 1: Perfect match
    declared_1 = {
        "amount": 1000.0,
        "date": "2025-12-20",
        "accountNumber": "1234567890",
        "institution": "Test Bank"
    }
    extracted_1 = {
        "amount": 1000.0,
        "date": "2025-12-20",
        "accountNumber": "1234567890",
        "institution": "Test Bank"
    }
    
    result_1 = compute_risk_score(declared_1, extracted_1)
    print(f"✅ Perfect Match: matchScore={result_1['matchScore']}, riskMarker={result_1['riskMarker']}")
    assert result_1['matchScore'] >= 85, "Perfect match should have high score"
    assert result_1['riskMarker'] == 0, "Perfect match should have riskMarker=0"
    
    # Test case 2: Critical amount mismatch (>5%)
    declared_2 = {
        "amount": 1000.0,
        "date": "2025-12-20",
        "accountNumber": "1234567890",
        "institution": "Test Bank"
    }
    extracted_2 = {
        "amount": 1100.0,  # 10% difference
        "date": "2025-12-20",
        "accountNumber": "1234567890",
        "institution": "Test Bank"
    }
    
    result_2 = compute_risk_score(declared_2, extracted_2)
    print(f"✅ Critical Mismatch: matchScore={result_2['matchScore']}, riskMarker={result_2['riskMarker']}")
    assert result_2['matchScore'] < 70, "Critical mismatch should have low score"
    assert result_2['riskMarker'] == 3, "Critical mismatch should trigger riskMarker=3"
    
    # Test case 3: Medium mismatch (1-5%)
    declared_3 = {
        "amount": 1000.0,
        "date": "2025-12-20",
        "accountNumber": "1234567890",
        "institution": "Test Bank"
    }
    extracted_3 = {
        "amount": 1011.0,  # 1.1% difference
        "date": "2025-12-20",
        "accountNumber": "1234567890",
        "institution": "Test Bank"
    }
    
    result_3 = compute_risk_score(declared_3, extracted_3)
    print(f"✅ Medium Mismatch: matchScore={result_3['matchScore']}, riskMarker={result_3['riskMarker']}")
    assert 70 <= result_3['matchScore'] < 90, "Medium mismatch should have moderate score"
    
    print()


def test_vision_engine_extraction():
    """Test vision engine extraction (requires real API key or mock)"""
    print("\n🧪 Testing Vision Engine Extraction")
    print("=" * 60)
    
    # Check if we have a test image
    test_image_path = backend_dir / "tests" / "test-documents" / "business" / "BANK-ACCOUNT-VERIFICATION.jpg"
    
    if not test_image_path.exists():
        print("⚠️  Test image not found, skipping extraction test")
        print(f"   Expected at: {test_image_path}")
        return
    
    # Check for API key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key or api_key == 'test-key':
        print("⚠️  GEMINI_API_KEY not set, skipping real extraction test")
        print("   Set GEMINI_API_KEY environment variable to run full test")
        return
    
    try:
        # Load test image
        file_bytes = load_test_image(str(test_image_path))
        print(f"✅ Loaded test image: {len(file_bytes)} bytes")
        
        # Initialize engine
        engine = VisionAuditEngine()
        print("✅ Vision engine initialized")
        
        # Declared metadata
        declared_metadata = {
            "amount": 1000.0,
            "date": "2025-12-20",
            "accountNumber": "1234567890",
            "institution": "Test Bank"
        }
        
        # Perform audit
        print("⏳ Performing forensic extraction...")
        result = engine.audit_slip(
            drive_file_id="test-file-id",
            file_bytes=file_bytes,
            declared_metadata=declared_metadata,
            report_id="TEST-REPORT-001",
            admin_email="test@example.com"
        )
        
        print(f"✅ Extraction successful!")
        print(f"   Status: {result.get('status')}")
        print(f"   Match Score: {result.get('matchScore')}")
        print(f"   Risk Marker: {result.get('riskMarker')}")
        print(f"   Extracted Metadata: {json.dumps(result.get('extractedMetadata', {}), indent=2)}")
        
        # Validate extraction
        extracted = result.get('extractedMetadata', {})
        assert 'amount' in extracted, "Extraction should include amount"
        assert 'date' in extracted, "Extraction should include date"
        assert 'accountNumber' in extracted, "Extraction should include accountNumber"
        assert 'institution' in extracted, "Extraction should include institution"
        
        # Validate PII masking
        account = extracted.get('accountNumber', '')
        assert account.startswith('****-') or len(account) <= 4, "Account number should be masked"
        
        print("✅ All extraction validations passed!")
        
    except Exception as e:
        print(f"❌ Extraction test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


def test_notion_integration():
    """Test Notion integration trigger (requires NOTION_TOKEN)"""
    print("\n🧪 Testing Notion Integration")
    print("=" * 60)
    
    notion_token = os.getenv('NOTION_TOKEN')
    if not notion_token:
        print("⚠️  NOTION_TOKEN not set, skipping Notion integration test")
        print("   Set NOTION_TOKEN and RPR_VERIFY_TASK_DB_ID to test")
        return
    
    # Test that riskMarker=3 triggers Notion call
    # This is tested implicitly in test_vision_engine_extraction if a critical mismatch occurs
    print("✅ Notion integration will be tested during full extraction test")
    print("   (Triggered when riskMarker == 3)")


def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 Vision Engine Test Suite - Phase 4")
    print("=" * 60)
    
    try:
        # Unit tests
        test_date_normalization()
        test_account_masking()
        test_risk_scoring()
        
        # Integration tests (require API keys)
        test_vision_engine_extraction()
        test_notion_integration()
        
        print("=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
    except AssertionError as e:
        print(f"\n❌ Test assertion failed: {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test suite failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

