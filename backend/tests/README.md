# RPR-VERIFY Test Suite

Comprehensive test suite for the RPR-VERIFY document processing service using real KYC documents.

## 📋 Overview

This test suite validates the RPR-VERIFY service's ability to:
- Process and analyze KYC documents (identity, proof of address, business verification)
- Extract OCR data accurately
- Classify document types
- Detect fraud indicators
- Generate reports

## 🗂️ Test Documents

### Real KYC Documents (4 files)

1. **PROOF-OF-IDENTIFICATION.jpg** - Western Australian Driver's License
   - **Location:** `test-documents/identity/`
   - **Expected Data:**
     - Name: GAVRIL VASILE
     - Address: 15 BUCHANAN RISE, COOGEE WA 6166
     - DOB: 11 Jan 1955
     - Expiry: 18 Apr 2026
     - License Number: 3554361

2. **PROOF-OF-ADDRESS.jpg** - Water Corporation Utility Bill
   - **Location:** `test-documents/proof-of-address/`
   - **Expected Data:**
     - Name: G & DM POP
     - Address: 15 BUCHANAN RISE, COOGEE WA 6166
     - Account: 90 00411 52 1
     - Amount: $489.15
     - Due Date: 5 Feb 2025

3. **ABN-VERIFICATION.jpg** - Australian Business Register Lookup
   - **Location:** `test-documents/business/`
   - **Expected Data:**
     - Entity: The Trustee for THE ARDEAL TRADING TRUST
     - ABN: 16 920 472 163
     - Trading Name: ARDEAL CONCRETE CONTRACTORS
     - Status: Active

4. **BANK-ACCOUNT-VERIFICATION.jpg** - Commonwealth Bank Statement
   - **Location:** `test-documents/business/`
   - **Expected Data:**
     - Bank: Commonwealth Bank
     - Account Holder: Mr John Doe
     - Address: 522 Flinders St, Melbourne VIC 3000
     - Account: 123 456 12345678
     - Balance: $11,709.75

### Invalid Test Files

- `test-documents/invalid/test.txt` - Plain text file (should be rejected)
- `test-documents/invalid/corrupted.jpg` - Corrupted image file (should be rejected)

## 🚀 Quick Start

### Prerequisites

```bash
# Required tools
brew install jq        # macOS
# or
apt-get install jq      # Linux

# Python 3 (usually pre-installed)
python3 --version
```

### Run All Tests

```bash
cd backend/tests/
./run-all-tests.sh
```

### Run Specific Tests

```bash
# Health check only
./test-rpr-verify.sh --quick

# Test specific document category
./test-rpr-verify.sh --document identity
./test-rpr-verify.sh --document proof-of-address
./test-rpr-verify.sh --document business

# Verbose mode
./test-rpr-verify.sh -v
```

## 📁 Directory Structure

```
backend/tests/
├── test-documents/
│   ├── identity/
│   │   └── PROOF-OF-IDENTIFICATION.jpg
│   ├── proof-of-address/
│   │   └── PROOF-OF-ADDRESS.jpg
│   ├── business/
│   │   ├── ABN-VERIFICATION.jpg
│   │   └── BANK-ACCOUNT-VERIFICATION.jpg
│   └── invalid/
│       ├── test.txt
│       └── corrupted.jpg
├── test-rpr-verify.sh          # Main test script
├── validate-results.py          # OCR validation script
├── run-all-tests.sh            # Master test runner
├── test-config.json            # Service configuration
├── test-document-inventory.json # Expected data catalog
└── README.md                   # This file
```

## 🧪 Test Cases

### Positive Tests

- **E2E-001:** Driver's License processing
- **E2E-002:** Utility bill processing
- **E2E-003:** ABN verification processing
- **E2E-004:** Bank statement processing

### Negative Tests

- **NEG-001:** Invalid file format rejection
- **NEG-002:** Missing required fields rejection
- **NEG-003:** Corrupted file handling

### Performance Tests

- **LOAD-001:** Processing time benchmarks

## 📊 Expected Results

### Processing Times

- Identity Document: < 15 seconds
- Proof of Address: < 10 seconds
- Business Verification: < 12 seconds
- Bank Statement: < 18 seconds

### Pass Thresholds

- OCR Confidence: ≥ 85%
- Quality Score: ≥ 70
- Fraud Score: ≥ 80%

## 🔍 Validation

After running tests, validate OCR results:

```bash
# Find latest results directory
LATEST_RESULTS=$(ls -td test-results-* | head -n1)

# Run validation
python3 validate-results.py \
    test-document-inventory.json \
    "$LATEST_RESULTS"
```

## 📝 Test Results

Test results are saved in timestamped directories:

```
test-results-YYYYMMDD-HHMMSS/
├── PROOF-OF-IDENTIFICATION.jpg.json
├── PROOF-OF-ADDRESS.jpg.json
├── ABN-VERIFICATION.jpg.json
├── BANK-ACCOUNT-VERIFICATION.jpg.json
└── test-report.md
```

## 🔧 Configuration

Edit `test-config.json` to customize:

- Service URL
- Timeout settings
- Expected processing times
- Pass thresholds

## ➕ Adding New Test Documents

1. Add document to appropriate category directory:
   ```bash
   cp new-document.jpg test-documents/identity/
   ```

2. Update `test-document-inventory.json`:
   ```json
   {
     "filename": "new-document.jpg",
     "type": "identity_document",
     "category": "identity",
     "expected_data": {
       "name": "Expected Name",
       "address": "Expected Address"
     }
   }
   ```

3. Run tests:
   ```bash
   ./test-rpr-verify.sh
   ```

## 🐛 Troubleshooting

### Service Not Available

```bash
# Check service URL in test-config.json
# Verify service is running:
curl https://rpr-verify-7kzxnscuuq-as.a.run.app/health
```

### OCR Accuracy Issues

- Check image quality (should be clear, high resolution)
- Verify expected data matches actual document content
- Review validation report for specific field failures

### Timeout Errors

- Increase timeout in `test-config.json`
- Check network connectivity
- Verify service performance

## 🔒 Security & Privacy

### Important Notes

⚠️ **These test documents are sanitized examples for testing purposes only.**

- Documents contain sample data, not real customer information
- All PII has been redacted or replaced with test data
- Do not use real customer documents in this test suite
- Test results may contain extracted data - handle appropriately

### PII Handling

- Test results are stored locally only
- Results directories are excluded from git (see `.gitignore`)
- Review extracted data before sharing test results
- Do not commit test results containing PII

## 📚 Additional Resources

- [RPR-VERIFY API Documentation](../docs/)
- [OCR Configuration Guide](../docs/ocr-config.md)
- [Fraud Detection Rules](../docs/fraud-rules.md)

## 🤝 Contributing

When adding new test cases:

1. Use real-world document examples (sanitized)
2. Document expected data in `test-document-inventory.json`
3. Update this README with new test case descriptions
4. Ensure tests are reproducible and consistent

## 📄 License

Test documents and scripts are part of the RPR-VERIFY project.

---

**Last Updated:** 2025-01-XX  
**Test Suite Version:** 1.0.0

