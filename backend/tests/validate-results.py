#!/usr/bin/env python3
"""
Validation script for RPR-VERIFY test results.
Compares OCR results with expected data from test-document-inventory.json
"""

import json
import sys
import os
from typing import Dict, List, Any
from difflib import SequenceMatcher

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'
BOLD = '\033[1m'

def similarity(str1: str, str2: str) -> float:
    """Calculate similarity between two strings (0.0 to 1.0)"""
    if not str1 or not str2:
        return 0.0
    return SequenceMatcher(None, str1.lower().strip(), str2.lower().strip()).ratio()

def find_field_in_ocr(ocr_text: str, field_name: str, expected_value: str) -> Dict[str, Any]:
    """Search for expected field value in OCR text"""
    # Simple keyword matching
    expected_lower = expected_value.lower()
    ocr_lower = ocr_text.lower()
    
    # Check for exact match
    if expected_lower in ocr_lower:
        return {
            "found": True,
            "match_type": "exact",
            "confidence": 1.0
        }
    
    # Check for partial match (key words)
    expected_words = set(expected_lower.split())
    ocr_words = set(ocr_lower.split())
    common_words = expected_words.intersection(ocr_words)
    
    if len(common_words) >= len(expected_words) * 0.6:  # 60% word match
        return {
            "found": True,
            "match_type": "partial",
            "confidence": len(common_words) / len(expected_words)
        }
    
    return {
        "found": False,
        "match_type": "none",
        "confidence": 0.0
    }

def validate_document(document_name: str, expected_data: Dict, api_response: Dict) -> Dict[str, Any]:
    """Validate a single document's OCR results"""
    results = {
        "document": document_name,
        "passed": True,
        "fields": {},
        "overall_confidence": 0.0,
        "errors": []
    }
    
    # Extract OCR text from API response
    extracted_data = api_response.get("extracted_data", {})
    ocr_text = ""
    
    if isinstance(extracted_data, dict):
        # Try to get raw_text or combine all text fields
        ocr_text = extracted_data.get("raw_text", "")
        if not ocr_text:
            # Combine all string values
            ocr_text = " ".join([str(v) for v in extracted_data.values() if isinstance(v, str)])
    elif isinstance(extracted_data, str):
        ocr_text = extracted_data
    
    if not ocr_text:
        results["passed"] = False
        results["errors"].append("No OCR text extracted")
        return results
    
    # Validate each expected field
    field_scores = []
    for field_name, expected_value in expected_data.items():
        if not expected_value or expected_value == "N/A":
            continue
            
        field_result = find_field_in_ocr(ocr_text, field_name, str(expected_value))
        field_scores.append(field_result["confidence"])
        
        results["fields"][field_name] = {
            "expected": expected_value,
            "found": field_result["found"],
            "confidence": field_result["confidence"],
            "match_type": field_result["match_type"]
        }
        
        if not field_result["found"]:
            results["passed"] = False
            results["errors"].append(f"Field '{field_name}' not found (expected: {expected_value})")
    
    # Calculate overall confidence
    if field_scores:
        results["overall_confidence"] = sum(field_scores) / len(field_scores)
    
    # Check quality score
    quality_score = api_response.get("quality_score", 0)
    if quality_score < 70:
        results["passed"] = False
        results["errors"].append(f"Quality score too low: {quality_score}")
    
    return results

def validate_all_results(inventory_path: str, results_dir: str) -> Dict[str, Any]:
    """Validate all test results"""
    # Load inventory
    with open(inventory_path, 'r') as f:
        inventory = json.load(f)
    
    validation_results = {
        "total_documents": 0,
        "passed": 0,
        "failed": 0,
        "documents": []
    }
    
    # Process each document
    for doc in inventory["test_documents"]:
        validation_results["total_documents"] += 1
        
        # Look for corresponding result file
        result_file = os.path.join(results_dir, f"{doc['filename']}.json")
        
        if not os.path.exists(result_file):
            validation_results["failed"] += 1
            validation_results["documents"].append({
                "document": doc["filename"],
                "passed": False,
                "error": "Result file not found"
            })
            continue
        
        # Load API response
        with open(result_file, 'r') as f:
            api_response = json.load(f)
        
        # Validate
        doc_result = validate_document(doc["filename"], doc["expected_data"], api_response)
        validation_results["documents"].append(doc_result)
        
        if doc_result["passed"]:
            validation_results["passed"] += 1
        else:
            validation_results["failed"] += 1
    
    return validation_results

def print_validation_report(results: Dict[str, Any]):
    """Print formatted validation report"""
    print(f"\n{BOLD}{BLUE}{'='*70}{RESET}")
    print(f"{BOLD}OCR Validation Report{RESET}")
    print(f"{BLUE}{'='*70}{RESET}\n")
    
    print(f"Total Documents: {results['total_documents']}")
    print(f"{GREEN}Passed: {results['passed']}{RESET}")
    print(f"{RED}Failed: {results['failed']}{RESET}\n")
    
    for doc_result in results["documents"]:
        status_color = GREEN if doc_result["passed"] else RED
        status_text = "PASS" if doc_result["passed"] else "FAIL"
        
        print(f"{status_color}{BOLD}[{status_text}]{RESET} {doc_result['document']}")
        
        if "overall_confidence" in doc_result:
            conf = doc_result["overall_confidence"]
            conf_color = GREEN if conf >= 0.85 else YELLOW if conf >= 0.70 else RED
            print(f"  Confidence: {conf_color}{conf:.2%}{RESET}")
        
        if "fields" in doc_result:
            for field_name, field_data in doc_result["fields"].items():
                if field_data["found"]:
                    print(f"  {GREEN}✓{RESET} {field_name}: {field_data['match_type']} match")
                else:
                    print(f"  {RED}✗{RESET} {field_name}: Not found")
        
        if "errors" in doc_result and doc_result["errors"]:
            for error in doc_result["errors"]:
                print(f"  {RED}ERROR:{RESET} {error}")
        
        print()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: validate-results.py <inventory.json> <results_directory>")
        sys.exit(1)
    
    inventory_path = sys.argv[1]
    results_dir = sys.argv[2]
    
    if not os.path.exists(inventory_path):
        print(f"Error: Inventory file not found: {inventory_path}")
        sys.exit(1)
    
    if not os.path.exists(results_dir):
        print(f"Error: Results directory not found: {results_dir}")
        sys.exit(1)
    
    results = validate_all_results(inventory_path, results_dir)
    print_validation_report(results)
    
    # Exit with error code if any tests failed
    if results["failed"] > 0:
        sys.exit(1)
    else:
        sys.exit(0)

