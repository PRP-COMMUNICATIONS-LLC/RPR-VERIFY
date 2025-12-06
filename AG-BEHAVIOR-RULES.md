# AG BEHAVIOR RULES (HELPER)
# Source of Truth: ANTIGRAVITY-RPR-VERIFY-IDE-RULES.md

## 1. Repo Structure
- Root: `rpr-verify/` (Angular app)
- NO `RPR-VERIFY-V1` or other subfolders.
- Main branch: `main`

## 2. Git Hygiene (.gitignore)
- IGNORED: `dist/`, `build/`, `.angular/`, `node_modules/`
- IGNORED: `qodana-report/`, `coverage/`
- IGNORED: `BACKUP-*/`, `*.tmp`, `*.bak`

## 3. Brand Tokens
- CSS Variables: `src/styles.css`
- Logo: `src/assets/rpr-verify-logo.svg`
- Use only defined tokens (Midnight, Ink, Cyan, Electric Blue).
- No new UI layout without design doc.

## 4. Interaction Rules
- **One Goal Per Request**: Split complex tasks.
- **Explicit File Scope**: List files in context.
- **Copy-Ready Output**: Return ALL code in a SINGLE fenced block (Section 3.4).

## 5. AG Command Template
```
AG-COMMAND
Context: ...
Goal: ...
Constraints: ...
Outputs: ...
```
For implementation, ensure final output is a single copyable block.

## 6. Output Format (Mandatory)
For any change summary or implementation result, AG MUST return a single fenced code block with:
  - `# Commit summary` line (<= 60 tokens),
  - `# Changes` bullet list (repo-relative paths),
  - optional `# Notes` section.
  - No `cci://` or absolute paths.

**Template:**
```
# Commit summary (<= 60 tokens)
<summary>

# Changes
- <change 1>
- <change 2>

# Notes
# ...
```
