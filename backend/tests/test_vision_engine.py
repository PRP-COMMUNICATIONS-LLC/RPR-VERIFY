#!/usr/bin/env python3
"""
Test suite for Vision Engine - Phase 4
Validates forensic extraction, error topology, regional lock, and audit trail.

Authority: PRD v12.4 - Phase 4 Execution Roadmap
"""
import sys
import os
from pathlib import Path

# Add backend directory to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

<<<<<<< Updated upstream
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

import pytest
# Now import vision engine
from vision_engine import (
    VisionAuditEngine,
    compute_risk_score,
    normalize_date,
    mask_account_number,
    VisionEngineError,
    RateLimitError,
    DocumentParseError,
    RegionalLockError,
    ForensicMetadataError,
    extract_document_data,
=======
import pytest
from vision_engine import (
    VisionEngineError, 
    RateLimitError, 
    DocumentParseError,
    ValidationError,
    RegionalLockError,
    ForensicMetadataError,
    extract_document_data, 
>>>>>>> Stashed changes
    REGION
)


def test_error_topology_integrity():
    """Verify that all RPR-VERIFY specific error classes inherit from the base."""
<<<<<<< Updated upstream
    assert issubclass(RateLimitError, VisionEngineError)
    assert issubclass(DocumentParseError, VisionEngineError)
    assert issubclass(RegionalLockError, VisionEngineError)
    assert issubclass(ForensicMetadataError, VisionEngineError)


def test_forensic_metadata_requirement():
    """Step 3: Ensure logic fails if Case ID is missing."""
    with pytest.raises(ForensicMetadataError) as excinfo:
        # Pass None as case_id - should raise ForensicMetadataError
        extract_document_data("dummy_image", None)

    assert excinfo.value.error_code == "AUDIT_TRAIL_BROKEN"


def test_regional_lock_constant():
    """Verify that the engine is locked to asia-southeast1."""
    assert REGION == "asia-southeast1"


def load_test_image(image_path: str) -> bytes:
    """Load test image file as bytes"""
    with open(image_path, 'rb') as f:
        return f.read()


def test_date_normalization():
    """Test date parsing normalization"""
    print("\n🧪 Testing Date Normalization")
=======
    print("\n🧪 Testing Error Topology Integrity")
>>>>>>> Stashed changes
    print("=" * 60)
    
    assert issubclass(RateLimitError, VisionEngineError)
    assert issubclass(DocumentParseError, VisionEngineError)
    assert issubclass(ValidationError, VisionEngineError)
    assert issubclass(RegionalLockError, VisionEngineError)
    assert issubclass(ForensicMetadataError, VisionEngineError)
    
    print("✅ All error classes properly inherit from VisionEngineError")
    print()


def test_forensic_metadata_requirement():
    """Step 3: Ensure logic fails if Case ID is missing."""
    print("\n🧪 Testing Forensic Metadata Requirement")
    print("=" * 60)
    
    with pytest.raises(ForensicMetadataError) as excinfo:
        # Pass None as case_id - should raise ForensicMetadataError
        extract_document_data("dummy_image", None)
    
    assert excinfo.value.error_code == "AUDIT_TRAIL_BROKEN"
    print("✅ ForensicMetadataError raised correctly when case_id is missing")
    print(f"   Error Code: {excinfo.value.error_code}")
    print()


def test_regional_lock_constant():
    """Verify that the engine is locked to asia-southeast1."""
    print("\n🧪 Testing Regional Lock")
    print("=" * 60)
    
    assert REGION == "asia-southeast1"
    print(f"✅ Regional lock verified: {REGION}")
    print()


def test_extract_document_data_with_valid_case_id():
    """Test that extract_document_data accepts a valid case_id."""
    print("\n🧪 Testing Extract Document Data (with valid case_id)")
    print("=" * 60)
    
    # This will fail at the API call level (no real credentials), but should pass the case_id check
    try:
        extract_document_data("dummy_image", "TEST-CASE-001")
        print("⚠️  Function call succeeded (may require API credentials for full test)")
    except ForensicMetadataError:
        print("❌ Unexpected: ForensicMetadataError raised with valid case_id")
        raise
    except (DocumentParseError, RateLimitError, Exception) as e:
        # Expected to fail at API level, but case_id validation should pass
        print(f"✅ Case ID validation passed (API error expected: {type(e).__name__})")
    print()


def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 Vision Engine Test Suite - Phase 4")
    print("=" * 60)
    
    try:
        # Unit tests
        test_error_topology_integrity()
        test_forensic_metadata_requirement()
        test_regional_lock_constant()
        test_extract_document_data_with_valid_case_id()
        
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
