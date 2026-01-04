#!/usr/bin/env python3
"""
CORS Verification Script for rpr-verify-backend Cloud Run Service

This script tests the CORS preflight (OPTIONS) and actual POST request
to verify that the extractIdentity endpoint is properly configured.

Usage:
    python test_cors_verification.py [SERVICE_URL]

Example:
    python test_cors_verification.py https://rpr-verify-backend-794095666194.asia-southeast1.run.app
"""

import sys
import requests
import json
from typing import Optional

def test_cors_preflight(service_url: str, origin: str = "http://localhost:4200") -> bool:
    """
    Test OPTIONS preflight request to verify CORS headers.
    
    Returns:
        bool: True if CORS headers are present and correct
    """
    print(f"\n🔍 Testing CORS Preflight (OPTIONS) from origin: {origin}")
    print(f"   Endpoint: {service_url}/extractIdentity")
    
    try:
        response = requests.options(
            f"{service_url}/extractIdentity",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            },
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response Headers:")
        
        # Check for required CORS headers
        cors_headers = {
            "access-control-allow-origin": response.headers.get("Access-Control-Allow-Origin"),
            "access-control-allow-methods": response.headers.get("Access-Control-Allow-Methods"),
            "access-control-allow-headers": response.headers.get("Access-Control-Allow-Headers"),
            "access-control-max-age": response.headers.get("Access-Control-Max-Age")
        }
        
        success = True
        for header_name, header_value in cors_headers.items():
            status = "✅" if header_value else "❌"
            print(f"   {status} {header_name}: {header_value}")
            if not header_value and header_name == "access-control-allow-origin":
                success = False
        
        # Verify origin is reflected correctly
        if cors_headers["access-control-allow-origin"] == origin or cors_headers["access-control-allow-origin"] == "*":
            print(f"   ✅ Origin reflection: CORRECT")
        else:
            print(f"   ❌ Origin reflection: MISMATCH (expected {origin}, got {cors_headers['access-control-allow-origin']})")
            success = False
        
        return success and response.status_code in [200, 204]
        
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {str(e)}")
        return False


def test_post_request(service_url: str, origin: str = "http://localhost:4200") -> bool:
    """
    Test actual POST request with CORS headers.
    
    Returns:
        bool: True if request succeeds (even if it returns an error, as long as CORS works)
    """
    print(f"\n🔍 Testing POST Request with CORS from origin: {origin}")
    print(f"   Endpoint: {service_url}/extractIdentity")
    
    # Create a minimal test payload (base64-encoded 1x1 pixel PNG)
    # This is a valid base64 image that won't cause parsing errors
    test_image_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    try:
        response = requests.post(
            f"{service_url}/extractIdentity",
            json={"document_image_base64": test_image_base64},
            headers={
                "Origin": origin,
                "Content-Type": "application/json"
            },
            timeout=30
        )
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin', 'MISSING')}")
        
        # Check if CORS header is present (even if request fails)
        has_cors_header = "Access-Control-Allow-Origin" in response.headers
        
        if response.status_code == 200:
            print(f"   ✅ Request successful")
            try:
                data = response.json()
                print(f"   Response: {json.dumps(data, indent=2)}")
            except:
                print(f"   Response: {response.text[:200]}")
        elif response.status_code == 400:
            print(f"   ⚠️  Request rejected (400 Bad Request) - This is expected for test image")
            print(f"   Response: {response.text[:200]}")
        else:
            print(f"   ⚠️  Unexpected status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
        
        return has_cors_header
        
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {str(e)}")
        return False


def test_health_endpoint(service_url: str) -> bool:
    """
    Test health endpoint to verify service is accessible.
    
    Returns:
        bool: True if service is responding
    """
    print(f"\n🔍 Testing Health Endpoint")
    print(f"   Endpoint: {service_url}/health")
    
    try:
        response = requests.get(f"{service_url}/health", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Service is online: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"   ❌ Unexpected status: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request failed: {str(e)}")
        return False


def main():
    """Main verification function."""
    # Get service URL from command line or use default
    if len(sys.argv) > 1:
        service_url = sys.argv[1].rstrip('/')
    else:
        service_url = "https://rpr-verify-backend-794095666194.asia-southeast1.run.app"
    
    print("=" * 70)
    print("CORS Verification for rpr-verify-backend Cloud Run Service")
    print("=" * 70)
    print(f"Service URL: {service_url}")
    
    # Test health endpoint first
    health_ok = test_health_endpoint(service_url)
    
    if not health_ok:
        print("\n❌ Service health check failed. Please verify the service URL.")
        sys.exit(1)
    
    # Test CORS preflight
    preflight_ok = test_cors_preflight(service_url)
    
    # Test POST request
    post_ok = test_post_request(service_url)
    
    # Summary
    print("\n" + "=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)
    print(f"Health Check:     {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"CORS Preflight:  {'✅ PASS' if preflight_ok else '❌ FAIL'}")
    print(f"POST Request:     {'✅ PASS' if post_ok else '❌ FAIL'}")
    
    if health_ok and preflight_ok and post_ok:
        print("\n✅ All tests passed! CORS is properly configured.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Please check the CORS configuration.")
        sys.exit(1)


if __name__ == "__main__":
    main()
