# -*- coding: utf-8 -*-
"""RPR-VERIFY Vision Engine Test Suite
Phase 4: Forensic validation for error topology, regional lock, and audit trail

Test Coverage:
- Error hierarchy integrity
- Regional lock enforcement (asia-southeast1)
- Forensic metadata requirement (case_id echo)

Authority: PRD v12.4 - Phase 4 Execution Roadmap
"""

import pytest
from ..vision_engine import (
    VisionEngineError, 
    RateLimitError, 
    DocumentParseError,
    RegionalLockError,
    ForensicMetadataError,
    extract_document_data, 
    REGION
)


def test_error_topology_integrity():
    """Verify that all RPR-VERIFY specific error classes inherit from the base."""
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


# NOTE: Integration tests with real image content require ADC credentials in local environment.
# To run full integration tests:
# 1. Ensure GOOGLE_APPLICATION_CREDENTIALS points to service-account.json
# 2. Run: pytest backend/functions/test_vision_engine.py -v
