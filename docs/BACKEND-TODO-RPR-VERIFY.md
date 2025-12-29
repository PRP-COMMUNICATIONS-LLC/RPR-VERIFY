# Backend TODO Checklist - RPR-VERIFY

This document tracks backend implementation tasks that are deferred during frontend-first development phases.

## Phase 1: Case Creation & CIS Report (Deferred)

| File Path | Function Name | Task Description |
| --- | --- | --- |
| `backend/vision_engine.py` | `VISION_PROMPT` | Update template to enforce JSON keys: `full_name`, `last_name`, `address`, `postcode` |
| `backend/main.py` | `scan_slip` | Implement `generate_case_id`; map and persist Step 1 metadata to `persistence_service` |
| `backend/services/persistence_service.py` | `save_step_one` | Explicitly index `full_name` and `postcode` within `search_indices` for ABN fallback |
| `backend/services/abn_lookup_service.py` | `lookup_abn_for_case` | Implement real ABN Registry API handshake using name/postcode indices |
| `backend/main.py` | `get_cis_report` | Create `GET` endpoint to retrieve enriched case records for the `/cis` route |

## Phase 2: Pending Verification (Deferred)

| File Path | Function Name | Task Description |
| --- | --- | --- |
| `backend/vision_engine.py` | `scan_slip` | Parse bank deposit slips to extract individual deposit amounts and timestamps |
| `backend/main.py` | `scan_slip` | Update to calculate `totalDeposits` and `lastDepositAt` per case record |
| `backend/services/risk_service.py` | `calculate_risk_level` | Create risk scoring function to return `riskLevel` (default: `UNKNOWN`) |
| `backend/main.py` | `get_pending_cases` | Implement `GET /api/v1/cases/pending` endpoint with `week` query parameter support |
| `backend/main.py` | `get_cis_report` | Ensure `GET /api/v1/cases/<caseId>/cis-report` returns aggregated deposit totals and risk metadata |

## Phase 3: Dispute Resolution (Deferred)

| File Path | Function Name | Task Description |
| --- | --- | --- |
| `backend/services/persistence_service.py` | `update_case` | Update `db.cases` to support `escalated: true` flag and `dispute_assets` array |
| `backend/main.py` | `get_dispute_assets` | Implement `GET /api/v1/cases/<caseId>/dispute-assets` endpoint to return phased list of metadata |
| `backend/main.py` | `generate_sentinel_note` | Create `POST /api/v1/sentinel/note` endpoint using Vision Engine (Gemini 1.5 Flash) to analyze asset file + case context and return 1–3 sentence factual summary |
| `backend/services/file_service.py` | `get_asset_file` | Ensure Download/Open actions route to secure S3 or local storage bucket for specific asset `fileName` |

## Phase 4: Case Creation & CIS Report Refinement (Deferred)

| File Path | Function Name | Task Description |
| --- | --- | --- |
| `backend/main.py` | `get_step_one_details` | Retrieve `currentCaseId` and associated Phase 1 deposit rows for Tab 1 display |
| `backend/services/cis_service.py` | `map_to_cis_template` | Map data from `persistence_service` to the field structure defined in `EXTERNAL-REPORT-MAIN.html` |
| `backend/main.py` | `cis_print_endpoint` | (Optional) Serve the raw HTML data for the `/cis` route to consume for print functionality |

## Notes

- All frontend components use mock data with `TODO` comments indicating backend integration points
- Risk levels: `UNKNOWN`, `LOW`, `MEDIUM`, `HIGH`
- Week format: `YYYY-WWW` (e.g., `2025-052`)
- Case ID format: `LASTNAME-YYYY-WWW` (e.g., `VASILE-2025-052`)
- Asset status: `PENDING`, `COMPLETE`, `NEEDS_REVIEW`
- Asset source: `Bank`, `Customer`, `Internal`, `System`

