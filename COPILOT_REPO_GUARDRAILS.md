# 🛡️ RPR-VERIFY | COPILOT REPO GUARDRAILS

**Authority:** RPR-KONTROL [v1.0]
**Context:** Strict Sentinel Core Identity Architecture.

## 🟢 Allowed Actions
VS Copilot is authorized to:
1.  **Modify Code:** Edit files within `src/app/features/`, `src/app/core/`, `src/app/shared/`, `backend/`, and `functions/`.
2.  **Create Features:** Create new feature folders ONLY inside `src/app/features/`.
3.  **Run Tests:** Execute `npm test` and `npm run build` to verify changes.
4.  **Read Archives:** Read files in `archived_logs/` for context, but do not edit them.

## 🔴 Forbidden Actions (Requires Human Confirmation)
VS Copilot must **STOP** and ask before:
1.  **Creating Top-Level Folders:** Do not create new directories in the project root (e.g., `src/app/components`, `new-folder/`).
2.  **Deleting Folders:** Do not execute `rm -rf` on any directory.
3.  **Touching Archives:** Do not modify or delete files in `archived_logs/` or `OLD-SCRIPTS/`.
4.  **Ghost Files:** Do not generate `.ts` files next to `.component.ts` files (avoid JIT duplication).

## 🔄 Mandatory Workflow
After any structural change (file creation/move/rename):
1.  **Audit:** Run `bash scripts/safety-audit.sh` to check for drift.
2.  **Verify:** Run `npm test` to ensure no import paths were broken.
