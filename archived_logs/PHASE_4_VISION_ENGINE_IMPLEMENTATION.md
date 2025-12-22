# Phase 4 Vision Engine Implementation - Complete

## Status: ✅ IMPLEMENTED

## Overview

The Phase 4 Vision Engine has been fully implemented with:
- **Structured Outputs** using Gemini 1.5 Flash (Gemini 2.5 Flash fallback)
- **Forensic Extraction** of amount, date, accountNumber, and institution
- **Risk Scoring** with `matchScore` (0-100) and `riskMarker` (0-3)
- **Notion Integration** for automatic escalation when `riskMarker == 3`
- **PII Masking** for account numbers (shows only last 4 digits)
- **Date Normalization** for various OCR date formats

## Implementation Details

### 1. Vision Engine (`backend/vision_engine.py`)

**Key Features:**
- Uses `google.generativeai` SDK with Gemini 1.5 Flash
- Enforces JSON structured output via `response_mime_type="application/json"`
- Extracts: `amount`, `date`, `accountNumber`, `institution`, `confidence`
- Normalizes dates to ISO format (YYYY-MM-DD)
- Masks account numbers for PII protection (format: `****-1234`)

**Risk Scoring Function:**
```python
compute_risk_score(declared_metadata, extracted_metadata)
```
Returns:
- `matchScore`: 0-100 (higher = better match)
- `riskMarker`: 0-3 (0=low, 1=medium, 2=high, 3=critical/escalate)
- `mismatches`: List of mismatched fields with severity

**Risk Marker Logic:**
- `riskMarker = 0`: matchScore >= 85 (Low risk)
- `riskMarker = 1`: matchScore 70-84 (Medium risk)
- `riskMarker = 2`: matchScore 50-69 (High risk)
- `riskMarker = 3`: matchScore < 50 OR critical amount mismatch (>5%) (Critical - escalates to Notion)

### 2. Notion Integration

**Automatic Escalation:**
When `riskMarker == 3`, the system automatically calls:
```python
create_rpr_verify_task(
    task_name=f"🚨 Critical Risk Dispute: {report_id}",
    status="Backlog",
    priority="High",
    phase="Phase 4.2",
    diagnostic_text="[Detailed mismatch information]"
)
```

**Requirements:**
- `NOTION_TOKEN` environment variable
- `RPR_VERIFY_TASK_DB_ID` environment variable
- Notion integration must have access to the database

### 3. API Endpoint (`/api/v1/slips/scan`)

**Route:** `POST /api/v1/slips/scan`

**Authentication:** Required (Firebase ID token)

**Request Body:**
```json
{
  "driveFileId": "string",
  "reportId": "string",
  "declaredMetadata": {
    "amount": 1000.0,
    "date": "2025-12-20",
    "accountNumber": "1234567890",
    "institution": "Test Bank"
  },
  "fileBytes": "base64-encoded-image-bytes"
}
```

**Response:**
```json
{
  "status": "success",
  "risk_level": 3,
  "matchScore": 45.5,
  "riskMarker": 3,
  "extractedMetadata": {
    "amount": 1100.0,
    "date": "2025-12-20",
    "accountNumber": "****-7890",
    "institution": "Test Bank",
    "confidence": 0.95
  },
  "mismatches": [
    {
      "field": "amount",
      "declared": 1000.0,
      "extracted": 1100.0,
      "difference": 100.0,
      "severity": "CRITICAL"
    }
  ]
}
```

### 4. Test Suite (`backend/tests/test_vision_engine.py`)

**Test Coverage:**
- ✅ Date normalization (various formats)
- ✅ Account number masking (PII protection)
- ✅ Risk score computation (perfect match, critical mismatch, medium mismatch)
- ✅ Vision engine extraction (requires `GEMINI_API_KEY`)
- ✅ Notion integration trigger (requires `NOTION_TOKEN`)

**Run Tests:**
```bash
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY
python backend/tests/test_vision_engine.py
```

## Verification Checklist

### Local Testing

- [ ] **Extraction Accuracy**: Model returns valid Python dict with all four required schema fields
  - Run: `python backend/tests/test_vision_engine.py`
  - Verify: `extractedMetadata` contains `amount`, `date`, `accountNumber`, `institution`

- [ ] **Risk Marker Logic**: Mismatched amount triggers `riskMarker = 3` and calls Notion handler
  - Test with: Declared amount = 1000, Extracted amount = 1100 (>5% difference)
  - Verify: `riskMarker == 3` and Notion task created

- [ ] **PII Masking**: Account number shows only last 4 digits
  - Verify: `extractedMetadata.accountNumber` format is `****-1234`

### Integration Testing

- [ ] **API Endpoint**: `/api/v1/slips/scan` accepts requests and returns correct response
  - Test with authenticated request
  - Verify response structure matches specification

- [ ] **Notion Escalation**: Critical risks create tasks in Notion database
  - Set `NOTION_TOKEN` and `RPR_VERIFY_TASK_DB_ID`
  - Trigger a critical mismatch
  - Verify task appears in Notion database

## Files Modified/Created

1. **`backend/vision_engine.py`** - Complete rewrite with structured outputs and risk scoring
2. **`backend/main.py`** - Added `/api/v1/slips/scan` route
3. **`backend/tests/test_vision_engine.py`** - Comprehensive test suite
4. **`backend/requirements.txt`** - Added `google-generativeai>=0.3.0`
5. **`operations/notion_report_handler.py`** - Notion integration (Method 1)
6. **`operations/test_notion_sync.py`** - Notion test script

## Environment Variables Required

### For Vision Engine:
- `GEMINI_API_KEY` (or stored in Google Secret Manager as `gemini-api-key`)

### For Notion Integration:
- `NOTION_TOKEN` - Notion integration token
- `RPR_VERIFY_TASK_DB_ID` - Notion database ID

## Next Steps

1. **Run Local Test Suite:**
   ```bash
   python backend/tests/test_vision_engine.py
   ```

2. **Set Environment Variables:**
   ```bash
   export GEMINI_API_KEY="your-key"
   export NOTION_TOKEN="your-token"
   export RPR_VERIFY_TASK_DB_ID="your-database-id"
   ```

3. **Test API Endpoint:**
   - Start Flask server: `python backend/main.py`
   - Send POST request to `/api/v1/slips/scan` with test data

4. **Verify Notion Integration:**
   - Trigger a critical mismatch (amount difference >5%)
   - Check Notion database for new task

## Limitations & Considerations

1. **Structured Outputs**: Gemini 1.5 Flash supports `response_mime_type="application/json"` but may not enforce strict schema. The code includes fallback parsing.

2. **Date Parsing**: Date normalization handles common formats but may fail on unusual OCR outputs. The original string is returned if parsing fails.

3. **Image Format**: Currently defaults to JPEG. MIME type detection uses magic bytes but may not be 100% accurate.

4. **Notion Rate Limits**: Notion API has rate limits (~3 requests/second). For high-volume usage, implement rate limiting.

5. **Error Handling**: If Notion integration fails, the audit still completes but escalation task is not created (logged as warning).

## Related Documentation

- `OPERATIONS/PROCESS/NOTION_SYNC_METHOD_1.md` - Notion integration guide
- `backend/examples/gemini_vision_vertex_ai.py` - Reference implementation (Vertex AI)

