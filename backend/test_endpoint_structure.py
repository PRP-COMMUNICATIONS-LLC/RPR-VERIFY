#!/usr/bin/env python3
"""
Quick validation script to test endpoint structure without requiring full dependencies.
Validates that the API endpoint structure is correct.
"""
import sys
from pathlib import Path

def test_endpoint_structure():
    """Test that the endpoint structure is correct"""
    print("=" * 60)
    print("🧪 Testing Endpoint Structure")
    print("=" * 60)
    
    # Test 1: Check main.py structure
    main_py = Path(__file__).parent / "main.py"
    if not main_py.exists():
        print("❌ main.py not found")
        return False
    
    content = main_py.read_text()
    
    checks = [
        ("Flask app created", "app = Flask(__name__)" in content),
        ("CORS enabled", "CORS(app)" in content),
        ("Endpoint defined", "@app.route('/api/v1/slips/scan'" in content),
        ("POST method", "methods=['POST']" in content),
        ("File extraction", "'file' not in request.files" in content),
        ("Metadata extraction", "request.form.get('caseId'" in content),
        ("Vision engine call", "vision_service.scan_slip" in content),
        ("Forensic metadata", "forensic_metadata" in content),
    ]
    
    all_passed = True
    for check_name, passed in checks:
        status = "✅" if passed else "❌"
        print(f"{status} {check_name}")
        if not passed:
            all_passed = False
    
    # Test 2: Check vision_engine.py structure
    vision_py = Path(__file__).parent / "vision_engine.py"
    if vision_py.exists():
        vision_content = vision_py.read_text()
        vision_checks = [
            ("VisionEngine class", "class VisionEngine" in vision_content),
            ("scan_slip method", "def scan_slip(self" in vision_content),
            ("Forensic metadata param", "forensic_metadata=None" in vision_content),
            ("Success flag in return", '"success": True' in vision_content),
            ("Extracted metadata", "extractedMetadata" in vision_content),
        ]
        
        print("\n" + "=" * 60)
        print("🧪 Testing Vision Engine Structure")
        print("=" * 60)
        
        for check_name, passed in vision_checks:
            status = "✅" if passed else "❌"
            print(f"{status} {check_name}")
            if not passed:
                all_passed = False
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ All structure checks passed!")
        print("=" * 60)
        return True
    else:
        print("❌ Some structure checks failed")
        print("=" * 60)
        return False

if __name__ == "__main__":
    success = test_endpoint_structure()
    sys.exit(0 if success else 1)
