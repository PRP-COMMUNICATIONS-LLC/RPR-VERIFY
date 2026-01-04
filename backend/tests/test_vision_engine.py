#!/usr/bin/env python3
"""
RPR-VERIFY Phase 4 Test Suite
Tests error topology, forensic metadata, and regional lock enforcement

Authority: PRD v12.4 - Phase 4 Execution Roadmap
"""
import sys
import os
from pathlib import Path
import unittest.mock as mock
import pytest
from unittest.mock import Mock, patch, MagicMock

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
                                return True
                        return MockDocument()
                return MockCollection()
        return MockDB()

sys.modules['firebase_admin'] = mock.MagicMock()
sys.modules['firebase_admin']._apps = [] # Mocked state
sys.modules['firebase_admin'].firestore = MockFirestore()

# Mock Vertex AI to prevent actual API initialization
# Create mock classes with required attributes
class MockHarmCategory:
    HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT"
    HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH"
    HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT"
    HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT"

class MockHarmBlockThreshold:
    BLOCK_NONE = "BLOCK_NONE"

class MockSafetySetting:
    def __init__(self, category=None, threshold=None):
        self.category = category
        self.threshold = threshold

class MockGenerativeModel:
    def __init__(self, *args, **kwargs):
        pass
    
    def generate_content(self, *args, **kwargs):
        # This will be patched in individual tests
        pass

sys.modules['vertexai'] = mock.MagicMock()
sys.modules['vertexai'].init = mock.MagicMock()  # Mock init() to prevent actual connection
sys.modules['vertexai.generative_models'] = mock.MagicMock()
sys.modules['vertexai.generative_models'].GenerativeModel = MockGenerativeModel
sys.modules['vertexai.generative_models'].SafetySetting = MockSafetySetting
sys.modules['vertexai.generative_models'].HarmCategory = MockHarmCategory
sys.modules['vertexai.generative_models'].HarmBlockThreshold = MockHarmBlockThreshold

# Mock tenacity retry decorator
sys.modules['tenacity'] = mock.MagicMock()
sys.modules['tenacity'].retry = lambda *args, **kwargs: lambda func: func
sys.modules['tenacity'].stop_after_attempt = mock.MagicMock()
sys.modules['tenacity'].wait_exponential = mock.MagicMock()

# --- STEP 2: Imports ---
from functions.vision_engine import (
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

class TestErrorTopology:
    """Test Step 1: Error class instantiation and inheritance"""
    
    def test_error_hierarchy(self):
        """Verify all error classes inherit from VisionEngineError"""
        errors = [
            RateLimitError,
            DocumentParseError,
            ValidationError,
            RegionalLockError,
            ForensicMetadataError
        ]
        for error_class in errors:
            assert issubclass(error_class, VisionEngineError)
    
    def test_error_messages(self):
        """Verify error classes can be instantiated with custom messages"""
        try:
            raise RateLimitError("Custom rate limit message")
        except VisionEngineError as e:
            assert "Custom rate limit message" in str(e)


class TestForensicMetadata:
    """Test Step 3: Forensic metadata presence and case_id echo"""
    
    @patch('functions.vision_engine.model')
    def test_case_id_echo(self, mock_model):
        """Verify case_id is echoed from request to response"""
        # Mock Vertex AI response
        mock_response = MagicMock()
        mock_response.text = '{"accountNumber": "12345678", "bsb": "123-456"}'
        mock_model.generate_content.return_value = mock_response
        
        test_case_id = "TEST-CASE-001"
        result = extract_document_data(b"fake_image_data", test_case_id)
        
        assert "case_id" in result
        assert result["case_id"] == test_case_id
        assert "forensic_metadata" in result
        assert result["forensic_metadata"]["case_id"] == test_case_id
    
    @patch('functions.vision_engine.model')
    def test_forensic_metadata_structure(self, mock_model):
        """Verify forensic_metadata contains required fields"""
        mock_response = MagicMock()
        mock_response.text = '{"accountNumber": "12345678"}'
        mock_model.generate_content.return_value = mock_response
        
        result = extract_document_data(b"fake_image_data", "TEST-002")
        
        forensic = result["forensic_metadata"]
        assert "case_id" in forensic
        assert "extracted_by" in forensic
        assert "region" in forensic
        assert forensic["region"] == "asia-southeast1"
        assert "timestamp" in forensic
        assert "model_version" in forensic
        assert "safety_threshold" in forensic
        assert forensic["safety_threshold"] == "BLOCK_NONE"
    
    def test_missing_case_id_raises_error(self):
        """Verify ForensicMetadataError raised when case_id is missing"""
        with pytest.raises(ForensicMetadataError) as excinfo:
            extract_document_data(b"fake_image_data", None)
        assert excinfo.value.error_code == "AUDIT_TRAIL_BROKEN"
        
        with pytest.raises(ForensicMetadataError):
            extract_document_data(b"fake_image_data", "")


class TestRegionalLock:
    """Test Step 2: Regional enforcement (asia-southeast1)"""
    
    @patch('functions.vision_engine.model')
    def test_region_in_metadata(self, mock_model):
        """Verify region is always asia-southeast1"""
        mock_response = MagicMock()
        mock_response.text = '{"data": "test"}'
        mock_model.generate_content.return_value = mock_response
        
        result = extract_document_data(b"fake_image_data", "TEST-003")
        
        assert result["forensic_metadata"]["region"] == "asia-southeast1"
    
    def test_regional_lock_constant(self):
        """Verify that the engine is locked to asia-southeast1."""
        assert REGION == "asia-southeast1"


class TestDocumentExtraction:
    """Test extraction logic with real-world scenarios"""
    
    @patch('functions.vision_engine.model')
    def test_bank_slip_extraction(self, mock_model):
        """Test bank slip data extraction"""
        mock_response = MagicMock()
        mock_response.text = '''{
            "accountNumber": "123456789",
            "bsb": "062-000",
            "accountHolder": "John Doe",
            "balance": "1234.56"
        }'''
        mock_model.generate_content.return_value = mock_response
        
        result = extract_document_data(b"fake_bank_slip", "BANK-TEST-001")
        
        assert "data" in result
        data = result["data"]
        assert "accountNumber" in data
        assert "bsb" in data
        assert result["case_id"] == "BANK-TEST-001"
    
    @patch('functions.vision_engine.model')
    def test_identity_doc_extraction(self, mock_model):
        """Test identity document extraction"""
        mock_response = MagicMock()
        mock_response.text = '''{
            "documentNumber": "P1234567",
            "fullName": "Jane Smith",
            "dateOfBirth": "1990-01-01",
            "expiryDate": "2030-12-31"
        }'''
        mock_model.generate_content.return_value = mock_response
        
        result = extract_document_data(b"fake_passport", "ID-TEST-001")
        
        assert "data" in result
        data = result["data"]
        assert "documentNumber" in data
        assert "fullName" in data
        assert result["case_id"] == "ID-TEST-001"


if __name__ == "__main__":
    # If run directly, execute tests
    pytest.main([__file__, "-v"])
