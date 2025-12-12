#!/usr/bin/env python3
import os
import sys
import json
import requests
import subprocess
import logging

# --- Configuration ---
SERVICE_NAME = "rpr-doc-processor"
REGION = "asia-southeast1"
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "gen-lang-client-0313233462")
TIMEOUT = 15

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_service_url():
    """Fetches the Cloud Run URL."""
    url = os.getenv("SERVICE_URL")
    if url: return url.rstrip("/")
    
    logger.info(f"🌍 Fetching URL for {SERVICE_NAME}...")
    try:
        cmd = [
            "gcloud", "run", "services", "describe", SERVICE_NAME,
            "--region", REGION,
            "--format", "value(status.url)",
            "--project", PROJECT_ID
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except Exception as e:
        logger.error(f"❌ Failed to get URL. Ensure you are logged in to gcloud. Error: {e}")
        sys.exit(1)

def run_tests(base_url):
    """Runs smoke tests against the service."""
    logger.info(f"🚀 Testing Target: {base_url}")
    failures = 0
    
    endpoints = [
        ("/health", "GET", None, 200),
        ("/analyze", "POST", {"document_id": "TEST", "content_base64": "dGVzdA=="}, 200),
        ("/risk-assessment", "POST", {"transaction_id": "TEST", "amount": 100}, 200)
    ]

    for path, method, payload, expected_status in endpoints:
        try:
            url = f"{base_url}{path}"
            if method == "GET":
                resp = requests.get(url, timeout=TIMEOUT)
            else:
                resp = requests.post(url, json=payload, timeout=TIMEOUT)
            
            if resp.status_code == expected_status:
                logger.info(f"✅ {path} passed")
            else:
                logger.error(f"❌ {path} failed: {resp.status_code} - {resp.text}")
                failures += 1
        except Exception as e:
            logger.error(f"❌ {path} connection error: {e}")
            failures += 1

    return failures

if __name__ == "__main__":
    url = get_service_url()
    if run_tests(url) > 0:
        sys.exit(1)
    logger.info("🎉 SUCCESS: Production Ready.")
