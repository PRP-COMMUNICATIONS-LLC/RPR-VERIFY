# C.I.S Report Generation

This module generates Customer Information Sheet (C.I.S) reports for client verification.

## Overview

The C.I.S report is a standardized document that contains client verification information. It is exported as a PDF from HTML templates.

## Critical Branding Rules

**⚠️ CRITICAL RULE:** The CUSTOMER INFORMATION SHEET (C.I.S) PDF output must be completely unbranded.

### What Must NOT Appear:
- ❌ No RPR logos
- ❌ No RPR-VERIFY references
- ❌ No company branding of any kind
- ❌ No service identifiers
- ❌ No application names

### What Must Appear:
- ✅ Generic professional formatting only
- ✅ Client data and required information fields
- ✅ Standard document structure
- ✅ Professional typography

## Report Templates

- `templates/EXTERNAL-CIS-BUSINESS.html` - Business entity reports
- `templates/EXTERNAL-CIS-INDIVIDUAL.html` - Individual reports

## Export Process

See `CIS_EXPORT_GUIDE.md` for detailed instructions on exporting HTML reports to PDF.

## Setup

```bash
python setup_assets.py
```

This script:
- Generates required image assets
- Creates base64 encoding for embedded images
- Prepares templates for export

## File Naming Convention

Exported PDFs should follow this naming pattern:
```
CIS-[TYPE]-[CUSTOMER_NAME]-[DDMMYYYY].pdf
```

Examples:
- `CIS-BUSINESS-ARDEAL-CONCRETE-02122025.pdf`
- `CIS-INDIVIDUAL-GAVRIL-POP-02122025.pdf`

## Compliance

All C.I.S reports must comply with:
- Client privacy requirements
- Data protection regulations
- Unbranded document standards
- Professional formatting guidelines
