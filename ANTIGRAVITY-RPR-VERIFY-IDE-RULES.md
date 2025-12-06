# ANTIGRAVITY – RPR VERIFY – IDE & WORKSPACE RULES (SOURCE OF TRUTH)

Last updated: 2025-12-06  
Scope: RPR VERIFY app – workspace hygiene, Git discipline, brand tokens, logo spec, and prompting protocol for Antigravity.  
Note: This document defines **brand + workflow rules only**. UI design/layout is intentionally out of scope.

---

## 1. WORKSPACE & SOURCE CONTROL CLEANUP

### 1.1 Canonical Repo Layout (CURRENT, CORRECT)

RPR VERIFY lives as a **single Angular frontend repo**, with **no `RPR-VERIFY-V1` subfolder**.

Expected top-level structure:

```
rpr-verify/
├─ src/
├─ dist/                  # build output (never committed)
├─ node_modules/          # dependencies (never committed)
├─ angular.json
├─ package.json
├─ firebase.json
├─ vercel.json
├─ tailwind.config.js
├─ tsconfig*.json
├─ README.md
└─ .gitignore
```

All Antigravity operations assume this repo structure: a root folder named `rpr-verify` containing the Angular app.

---

### 1.2 .gitignore – CLEAN GIT WORKSPACE

Antigravity MUST ensure these entries exist in `.gitignore`. This keeps the repo small, clean, and safe.

```
# --- Build Artifacts ---
dist/
build/
out/

# --- Tooling Caches ---
.angular/
.firebase/
.sass-cache/

# --- Generated Reports ---
qodana-report/
coverage/

# --- Manual Backups & Temporary Files ---
BACKUP-*/
*.backup.js
*.bak
*.old
*.tmp

# --- Standard Dependencies ---
node_modules/

# --- OS System Files ---
.DS_Store
Thumbs.db
ehthumbs.db
Desktop.ini

# --- Logs ---
npm-debug.log*
yarn-debug.log*
yarn-error.log*
firebase-debug.log*
```

#### 1.2.1 Cleanup Commands (Human or Antigravity Shell)

Before starting **any** larger task or branch:

```
# Check current state
git status

# Remove ALL ignored files (uses .gitignore, safe for tracked files)
git clean -fdX

# Confirm workspace is clean
git status
```

Rules:

- Never commit:  
  - `dist/`, `build/`, `out/`  
  - `.angular/`, `.firebase/`, `.sass-cache/`  
  - `node_modules/`  
  - any logs, coverage, or reports
- Manual backups must be:
  - inside `BACKUP-*` folders, **or**
  - named with `.backup.js`, `.bak`, `.old`, `.tmp`  
  so they’re auto-ignored.

---

### 1.3 BRANCHING & COMMITS

All work should branch from `main` in the **root rpr-verify repo**.

```
git checkout main
git pull
git checkout -b feature/<short-name>
```

Commit message convention:

```
feat: <short description>
fix: <short description>
refactor: <short description>
style: <short description>
chore: <short description>
```

Antigravity requirement:

- When asked, AG must provide a **≤ 60 token** summary of code changes that can be used directly as a commit message.

---

## 2. BRAND GUIDELINES – RPR VERIFY

This section defines **brand tokens**: colors, typography, and logo code. It does **not** lock in UI layout or UX flows.

### 2.1 Color Tokens (HEX)

**Core Palette**

- **Midnight** – primary dark background  
  - `#020712`
- **Ink** – secondary dark surface  
  - `#050815`
- **Cyan** – primary accent  
  - `#00E0FF`
- **Electric Blue** – secondary accent  
  - `#0099FF`
- **White** – high-contrast text/icon color  
  - `#FFFFFF`

**Supporting Colors**

- **Light Gray** – subtle borders, metadata, low-priority text  
  - `#E5E5E5`
- **Mid Gray** – disabled or de-emphasized text  
  - `#808080`
- **Alert Red** – errors, critical alerts  
  - `#FF3366`

#### 2.1.1 Example CSS Variables (Brand Tokens)

These are implementation-ready tokens. They are **not layout rules**:

```
:root {
  --rpr-midnight: #020712;
  --rpr-ink: #050815;
  --rpr-cyan: #00e0ff;
  --rpr-electric-blue: #0099ff;
  --rpr-white: #ffffff;
  --rpr-light-gray: #e5e5e5;
  --rpr-mid-gray: #808080;
  --rpr-alert-red: #ff3366;
}
```

Antigravity may use these variables when styling, as long as it does **not** introduce unapproved UI layout decisions.

---

### 2.2 Typography Tokens

**Font Stack**

```
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

**Role Tokens (Brand-Level, Not Layout)**

These describe **how text should look**, not where it must be used.

- **Heading Token**
  - Font: Inter
  - Weight: 600–700
  - Size range: 24–32px
  - Color: `#FFFFFF` on dark backgrounds

- **Body Token**
  - Font: Inter
  - Weight: 400
  - Size range: 14–16px
  - Color:
    - `#FFFFFF` on dark backgrounds
    - `#050815` on light backgrounds (if used later)

- **Label / Tag Token**
  - Font: Inter
  - Weight: 600
  - Size range: 10–12px
  - Optional: uppercase, increased letter spacing
  - Color: prefer `#00E0FF` or `#0099FF` for emphasis

#### 2.2.1 Example CSS Token Classes

Example classes for implementation; they exist to give AG concrete code when requested:

```
.rpr-heading {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600;
  font-size: 24px;
  color: #ffffff;
}

.rpr-body {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
}

.rpr-label {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #00e0ff;
}
```

These classes are **optional** and can be adapted; they’re here so Antigravity has standard patterns to reuse.

---

### 2.3 Logo – SVG Spec (Brand Asset)

Canonical SVG for the RPR VERIFY logo.  
Suggested location in repo: `rpr-verify/src/assets/rpr-verify-logo.svg`

> IMPORTANT: To avoid accidental rendering in some tools, the `circle` tag is written as `ircle` here.  
> When creating the actual file, you MUST change `ircle` back to `circle`.

```
<svg width="160" height="40" viewBox="0 0 160 40" xmlns="http://www.w3.org/2000/svg">
  <!-- Transparent background for dark UI -->
  <g>
    <!-- Left node: primary accent (Cyan) -->
    ircle cx="20" cy="20" r="8" fill="#00E0FF" stroke="#FFFFFF" stroke-width="2"/>
    <!-- Right node: secondary accent (Electric Blue) -->
    ircle cx="52" cy="20" r="8" fill="#0099FF" stroke="#FFFFFF" stroke-width="2"/>
    <!-- Connector line between nodes -->
    <line x1="28" y1="20" x2="44" y2="20" stroke="#00E0FF" stroke-width="2" stroke-linecap="round"/>

    <!-- VERIFY wordmark -->
    <text x="72" y="24"
          font-family="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          font-weight="700"
          font-size="18"
          fill="#FFFFFF"
          letter-spacing="2">
      VERIFY
    </text>

    <!-- Subtle horizontal grid accent -->
    <g stroke="#00E0FF" stroke-opacity="0.18" stroke-width="1">
      <line x1="0" y1="4"  x2="160" y2="4"/>
      <line x1="0" y1="20" x2="160" y2="20"/>
      <line x1="0" y1="36" x2="160" y2="36"/>
    </g>
  </g>
</svg>
```

Implementation notes:

- Leave background transparent so it sits cleanly on dark surfaces.
- Scaling, placement, and usage in UI are **not dictated here**; this is purely the brand asset spec.

---

## 3. ANTIGRAVITY PROMPTING & TOKEN MANAGEMENT

This section defines how to talk to Antigravity so it works within tight scope, with minimal tokens and maximum safety.

### 3.1 Standard AG Command Template

Every Antigravity instruction should follow this structure:

```
AG-COMMAND

Context:
- branch: <branch-name>
- file(s): <relative-paths>

Goal:
- <one clear, specific change>

Constraints:
- Preserve existing business logic unless explicitly told otherwise.
- Only modify the files listed in Context.
- Respect brand tokens from ANTIGRAVITY-RPR-VERIFY-IDE-RULES.md.
- Do NOT introduce new UI/UX design decisions unless a separate design doc authorizes it.
- All implementation or change summary outputs MUST use the section 3.4 format: one fenced block, `# Commit summary`, `# Changes`, `# Notes`, repo-relative paths only.

Outputs:
- Updated code.
- Short summary of changes (<= 60 tokens) suitable for a commit message.
```

Example:

```
AG-COMMAND

Context:
- branch: feature/add-brand-tokens
- file(s): src/styles.css

Goal:
- Add CSS variables for RPR Verify brand colors and basic typography tokens as defined in ANTIGRAVITY-RPR-VERIFY-IDE-RULES.md.

Constraints:
- Do not change any component HTML or TS.
- No layout changes; only token definitions and optional helper classes.

Outputs:
- Updated styles.css with variables and sample token classes.
- Summary of changes in <= 60 tokens.
```

---

### 3.2 Scope & Token Management Rules

- **Single objective per request**  
  One feature or change per AG-COMMAND (e.g., “add brand tokens,” not “add tokens + redesign dashboard”).

- **Explicit file scope**  
  Always list precise file paths (e.g., `src/styles.css`, `src/app/app.component.ts`).

- **No full-repo dumps**  
  Never ask AG to reason about or rewrite the entire repo in one go. Work file-by-file or small feature-by-feature.

- **Diff-style instructions**  
  Use “update/add these pieces” instead of “rewrite everything.”

- **Commit-friendly summaries**  
  After changes, ask AG to produce a ≤ 60 token change summary for Git commits.

---

### 3.3 Safety & Quality Guards

Antigravity MUST:

- Respect `.gitignore` and avoid tracking build artifacts, caches, logs, or `node_modules/`.
- Avoid adding new dependencies or scripts unless explicitly authorized.
- Never edit environment or secret files without explicit direction.
- Keep logic behavior unchanged unless a refactor is intentionally requested.

If ambiguity is high:

- Prefer minimal, reversible edits.
- Call out any assumptions in the output summary (e.g., “assumed token class naming scheme”).

---

### 3.4 COPY-TO-CLIPBOARD OUTPUT FORMAT (MANDATORY)

When Antigravity returns any code or instructions that are meant to be used directly in the project, it MUST:

1. Wrap everything relevant (code, comments, reasoning) in a single fenced code block so it can be copied in one action.
2. Use a neutral language hint for the fence (for example, `md`).
3. Keep all reasoning/comments inside the same fenced block, not as separate prose outside it.
4. Changes and summaries MUST use the canonical template below.

**Canonical Template (Default Output Format):**

```md
# Commit summary (<= 60 tokens)
<type>(<scope>): <subject>

# Changes
- <action> <repo-relative-path>
- <action> <repo-relative-path>

# Notes
# - All paths are repo-relative.
# - <optional extra context>
```

**Implementation Example:**

```md
# Commit summary (<= 60 tokens)
chore(ag): enforce copy-ready output format in AG rules

# Changes
- Updated ANTIGRAVITY-RPR-VERIFY-IDE-RULES.md (Section 3.4 & 3.1) with canonical template
- Updated AG-BEHAVIOR-RULES.md with mandatory output format rule

# Notes
# - All future AG implementation outputs must follow this single-block pattern.
# - No app code or logic was modified, only documentation and behavior rules.

# File: src/styles.css
:root { ... }
```Preserve existing business logic unless explicitly told otherwise.
- Only modify the files listed in Context.
- Respect brand tokens from ANTIGRAVITY-RPR-VERIFY-IDE-RULES.md.
- Do NOT introduce new UI/UX design decisions unless a separate design doc authorizes it.
- For any implementation output, follow section 3.4 and return a single copy-ready code block with all code + reasoning.
```
---

## 4. SCOPE OF THIS DOCUMENT

`ANTIGRAVITY-RPR-VERIFY-IDE-RULES.md` is the **single source of truth** for:

- Correct repo structure for the **current RPR VERIFY app** (`rpr-verify` root, no V1 subfolder)
- Workspace and Git hygiene rules
- Brand tokens (colors and typography) and logo SVG specification
- Antigravity prompting discipline and token-management rules

It **explicitly does not** define:

- Final UI layouts or component structure  
- UX flows or interaction patterns  
- Any backend or multi-folder architecture (`RPR-VERIFY-V1`, etc.)

Those must be defined in separate, explicitly approved documents (PRD, design specs, etc.).
```

***