# Notion Sync Method 1 - Implementation Guide

## Overview

Method 1 uses **direct HTTP POST requests** to the Notion API (`https://api.notion.com/v1/pages`) to create tasks in the RPR-VERIFY task database. This is a lightweight, dependency-free approach that uses only the `requests` library.

## Status

**Current Status:** ✅ IMPLEMENTED - Pending Verification

## Prerequisites

1. **Notion Integration Token**
   - Create a Notion integration at https://www.notion.so/my-integrations
   - Copy the "Internal Integration Token"
   - Grant the integration access to your RPR-VERIFY task database

2. **Database ID**
   - Open your Notion database
   - Copy the database ID from the URL: `https://www.notion.so/{WORKSPACE}/{DATABASE_ID}?v=...`
   - The database ID is the 32-character hex string

3. **Database Schema Requirements**
   The database must have these properties:
   - **Task Name** (Type: Title)
   - **Status** (Type: Status) - with options like "Backlog", "In Progress", "Done"
   - **Priority** (Type: Select) - with options like "Low", "Medium", "High"
   - **Phase** (Type: Select) - with options like "Phase 4.2", etc.

## Setup

### 1. Install Dependencies

The handler requires the `requests` library. If not already installed:

```bash
pip install requests
```

Or add to `backend/requirements.txt`:
```
requests>=2.31.0
```

### 2. Set Environment Variables

```bash
export NOTION_TOKEN="your_notion_integration_token_here"
export RPR_VERIFY_TASK_DB_ID="your_database_id_here"
```

For persistent setup, add to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
# Notion Integration - Method 1
export NOTION_TOKEN="ntn_..."
export RPR_VERIFY_TASK_DB_ID="abc123def456..."
```

### 3. Verify Setup

Run the test script:

```bash
cd /Users/puvansivanasan/PERPLEXITY/JOBS/CLIENT-2025-003-VERIFY/OPERATIONS/RPR-VERIFY
python operations/test_notion_sync.py
```

Expected output:
```
🧪 Testing Notion Method 1 Integration
✅ NOTION_TOKEN: ****...
✅ RPR_VERIFY_TASK_DB_ID: abc12345...def67890
✅ Successfully created Notion task: https://www.notion.so/...
✅ TEST SUCCESSFUL!
```

## Usage

### Python API

```python
from operations.notion_report_handler import create_rpr_verify_task

# Create a task
result = create_rpr_verify_task(
    task_name="🛠️ Firebase Deploy Alignment: Fix functions target mismatch",
    status="Backlog",
    priority="Medium",
    phase="Phase 4.2",
    diagnostic_text="CI Job 0_deploy.txt failed at step 'firebase deploy --only functions'. Root cause: Target mismatch in firebase.json."
)

print(f"Created task: {result['url']}")
```

### Command Line

```bash
python operations/notion_report_handler.py test
```

## Implementation Details

### API Endpoint
- **URL:** `POST https://api.notion.com/v1/pages`
- **Headers:**
  - `Authorization: Bearer <NOTION_TOKEN>`
  - `Notion-Version: 2022-06-28`
  - `Content-Type: application/json`

### Payload Structure

```json
{
  "parent": { "database_id": "RPR_VERIFY_TASK_DB_ID" },
  "properties": {
    "Task Name": { "title": [{ "text": { "content": "Task name here" } }] },
    "Status": { "status": { "name": "Backlog" } },
    "Priority": { "select": { "name": "Medium" } },
    "Phase": { "select": { "name": "Phase 4.2" } }
  },
  "children": [
    { "object": "block", "heading_2": { "rich_text": [{ "text": { "content": "Forensic Diagnostic" } }] } },
    { "object": "block", "paragraph": { "rich_text": [{ "text": { "content": "Diagnostic text here" } }] } }
  ]
}
```

## Verification Checklist

After running the test script:

- [ ] Task appears in the Notion database
- [ ] Task Name is correct
- [ ] Status property is set correctly
- [ ] Priority property is set correctly
- [ ] Phase property is set correctly
- [ ] "Forensic Diagnostic" heading appears
- [ ] Diagnostic text paragraph appears
- [ ] Task URL is accessible

Once verified, update this document:
- **Status:** ✅ VERIFIED

## Limitations & Considerations

1. **Rate Limits:** Notion API has rate limits (typically 3 requests per second). For high-volume usage, implement rate limiting or use batch operations.

2. **Permissions:** The Notion integration must have:
   - "Can insert content" permission on the database
   - Access granted to the specific database (via Notion's "..." menu)

3. **Property Names:** The property names in the code (`Task Name`, `Status`, `Priority`, `Phase`) must exactly match the property names in your Notion database. If your database uses different names, update `operations/notion_report_handler.py`.

4. **Status/Select Values:** The status and select values (e.g., "Backlog", "Medium") must exist as options in your Notion database. If they don't, the API will return an error.

5. **Error Handling:** The handler raises clear exceptions for:
   - Missing environment variables
   - Invalid API responses
   - Network errors

## Troubleshooting

### Error: "NOTION_TOKEN environment variable is required"
- **Solution:** Set the `NOTION_TOKEN` environment variable

### Error: "RPR_VERIFY_TASK_DB_ID environment variable is required"
- **Solution:** Set the `RPR_VERIFY_TASK_DB_ID` environment variable

### Error: "Could not find database with ID"
- **Solution:** 
  - Verify the database ID is correct
  - Ensure the Notion integration has access to the database (check the "..." menu in Notion)

### Error: "property 'Status' does not exist"
- **Solution:** Update the property names in `notion_report_handler.py` to match your database schema

### Error: "status option 'Backlog' does not exist"
- **Solution:** Update the status/select values to match the options available in your Notion database

## Next Steps

- [ ] Run test script and verify task creation
- [ ] Update status to "VERIFIED" once confirmed
- [ ] Integrate into CI/CD pipeline if needed
- [ ] Document any custom property mappings

## Related Files

- `operations/notion_report_handler.py` - Main handler implementation
- `operations/test_notion_sync.py` - Test script
- `create_triad_job.py` - Alternative Notion integration (uses SDK, different use case)

