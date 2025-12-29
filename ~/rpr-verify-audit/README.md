# RPR-VERIFY Firestore Audit Workspace

This dedicated workspace provides a standalone audit tool to verify data flow from the **Singapore Engine** to **Firestore**.

## Setup Complete ✅

- ✅ Directory created: `~/rpr-verify-audit`
- ✅ Node.js project initialized
- ✅ `firebase-admin` installed
- ✅ `verify-audit.cjs` script created

## Next Steps

### 1. Place Service Account JSON File

Copy your Firebase service account JSON file to this directory and rename it to:
```
rpr-verify-b-firebase-adminsdk.json
```

### 2. Secure File Permissions (Mac/Linux)

```bash
chmod 600 rpr-verify-b-firebase-adminsdk.json
```

### 3. Run the Audit

```bash
node verify-audit.cjs
```

## Service Account JSON Requirements

Your `rpr-verify-b-firebase-adminsdk.json` file must contain:

| Field | Required Value |
|-------|----------------|
| `type` | `"service_account"` |
| `project_id` | `"rpr-verify-b"` |
| `private_key` | Must include `\n` for newlines |
| `client_email` | `google-drive-admin@rpr-verify-b.iam.gserviceaccount.com` |
| `token_uri` | `"https://oauth2.googleapis.com/token"` |

## Expected Output

**Success:**
```
✅ Firebase Admin initialized with service account
📋 Service Account: google-drive-admin@rpr-verify-b.iam.gserviceaccount.com
📡 Jules: Scanning "escalations" collection...
🟢 FORENSIC MATCH FOUND
Report ID: [document-id]
Data: { ... }
```

**No Data:**
```
✅ Firebase Admin initialized with service account
📡 Jules: Scanning "escalations" collection...
⚪ Grid Status: Clean. No reports found in "escalations".
👉 Action: Open https://verify.rprcomms.com and trigger a report.
```

## Troubleshooting

- **"Service account file not found"**: Ensure the JSON file is in the same directory as `verify-audit.cjs`
- **"Initialization Error"**: Check the JSON structure matches the required format
- **"Permission denied"**: Verify the service account has Firestore access permissions
- **"Index not ready"**: The script will fall back to a raw fetch if the index isn't ready
