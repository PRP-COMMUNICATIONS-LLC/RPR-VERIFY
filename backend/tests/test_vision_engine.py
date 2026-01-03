#!/usr/bin/env python3
"""
Test suite for Vision Engine - Phase 4
Validates forensic extraction, error topology, regional lock, and audit trail.

Authority: PRD v12.4 - Phase 4 Execution Roadmap
"""
import sys
import os
from pathlib import Path
import unittest.mock as mock
import pytest

# Add backend directory to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# --- STEP 1: Mocks ---

class MockSecretManagerClient:
    """Mock Secret Manager Client"""
    def __init__(self, *args, **kwargs):
        pass
    
    def access_secret_version(self, request):
        class MockResponse:
            def __init__(self):
                self.payload = type('obj', (object,), {
                    'data': os.getenv('GEMINI_API_KEY', 'test-key').encode('UTF-8')
                })()
        return MockResponse()

# Mock Google Cloud Secret Manager before imports
sys.modules['google.cloud.secretmanager'] = mock.MagicMock()
sys.modules['google.cloud.secretmanager'].SecretManagerServiceClient = MockSecretManagerClient

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

sys.modules['firebase_admin'] = mock.MagicMock()
sys.modules['firebase_admin']._apps = [] # Mocked state
sys.modules['firebase_admin'].firestore = MockFirestore()

# --- STEP 2: Imports ---
from vision_engine import (
    VisionAuditEngine,
    compute_risk_score,
    normalize_date,
    mask_account_number,
    VisionEngineError,
    RateLimitError,
    DocumentParseError,
    ValidationError,
    RegionalLockError,
    ForensicMetadataError,
    extract_document_data,
    REGION
)

# --- STEP 3: Tests ---

def test_error_topology_integrity():
    """Verify that all RPR-VERIFY specific error classes inherit from the base."""
    print("\n🧪 Testing Error Topology Integrity")
    print("=" * 60)
    assert issubclass(RateLimitError, VisionEngineError)
    assert issubclass(DocumentParseError, VisionEngineError)
    assert issubclass(ValidationError, VisionEngineError)
    assert issubclass(RegionalLockError, VisionEngineError)
    assert issubclass(ForensicMetadataError, VisionEngineError)
    print("✅ All error classes properly inherit from VisionEngineError")


def test_forensic_metadata_requirement():
    """Ensure logic fails if Case ID is missing."""
    print("\n🧪 Testing Forensic Metadata Requirement")
    print("=" * 60)
    with pytest.raises(ForensicMetadataError) as excinfo:
        extract_document_data("dummy_image", None)
    assert excinfo.value.error_code == "AUDIT_TRAIL_BROKEN"
    print("✅ ForensicMetadataError raised correctly when case_id is missing")


def test_regional_lock_constant():
    """Verify that the engine is locked to asia-southeast1."""
    print("\n🧪 Testing Regional Lock")
    print("=" * 60)
    assert REGION == "asia-southeast1"
    print(f"✅ Regional lock verified: {REGION}")


def test_date_normalization():
    """Test date parsing normalization"""
    print("\n🧪 Testing Date Normalization")
    print("=" * 60)
    assert normalize_date("2024-01-01") == "2024-01-01"
    assert normalize_date("Jan 1, 2024") == "2024-01-01"
    assert normalize_date("01/01/2024") == "2024-01-01"
    assert normalize_date("invalid-date") is None
    print("✅ Date normalization functional")


def load_test_image(image_path: str) -> bytes:
    """Load test image file as bytes"""
    with open(image_path, 'rb') as f:
        return f.read()


def test_extract_document_data_with_valid_case_id():
    """Test that extract_document_data accepts a valid case_id."""
    print("\n🧪 Testing Extract Document Data (with valid case_id)")
    print("=" * 60)
    try:
        # Expecting API-level failure if no real network, but case_id check should pass first
        extract_document_data("dummy_image", "TEST-CASE-001")
    except ForensicMetadataError:
        pytest.fail("ForensicMetadataError raised with valid case_id")
    except (DocumentParseError, RateLimitError, Exception) as e:
        # Expected to fail at API level, but case_id validation should pass
        print(f"✅ Case ID validation passed (API error expected: {type(e).__name__})")
    print()


if __name__ == "__main__":
    # If run directly, execute tests
    pytest.main([__file__, "-v"])
