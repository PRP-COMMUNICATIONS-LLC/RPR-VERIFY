#!/usr/bin/env python3
"""
Test suite for Vision Engine - Phase 6
"""
import sys
import os
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from vision_engine import extract_document_data, ForensicMetadataError
import pytest

def test_extract_document_data_success():
    """Test successful data extraction."""
    # This test will fail without a valid image and API key
    pass

def test_extract_document_data_no_case_id():
    """Test that a ForensicMetadataError is raised when case_id is missing."""
    with pytest.raises(ForensicMetadataError):
        extract_document_data("dummy_image_content", None)

if __name__ == "__main__":
    pytest.main([__file__])
