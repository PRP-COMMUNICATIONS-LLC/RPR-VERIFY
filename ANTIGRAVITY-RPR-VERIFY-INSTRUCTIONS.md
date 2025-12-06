## ANTIGRAVITY IMPLEMENTATION BRIEF — RPR VERIFY (PORT 4200 ONLY)

### GLOBAL RULES

- Work ONLY inside `/Users/puvansivanasan/PERPLEXITY/rpr-verify/`.
- Dev server port is **fixed at 4200**:
  - Never accept or start on any other port.
  - If 4200 is busy, STOP the process using it; do not switch ports. [web:52][web:53]
- Always follow this sequence:
  1. In the terminal running Angular: press `Ctrl+C` until `ng serve` stops.
  2. Confirm no Angular dev server is running (no `ng serve` process, port 4200 free).
  3. Edit files in WebStorm.
  4. Save all files.
  5. Run `npm run build`.
  6. Run `npm start` (must bind to http://localhost:4200/).
- Every fix must include an `AG-LESSON` comment near the change explaining what was corrected, so mistakes are not repeated. [file:cc3cb071-b079-4d7e-af3c-2d0b18d182ab]

---

### LAYOUT & VISUAL REFERENCES

- **Visual 1**: Main dashboard + left sidebar layout (Reports view) — reference for global shell/sidebar and dark theme. [image:1]
- **Visual 2**: New Case screen — reference for `/cases/new` content/layout. [image:2]
- **Visual 3**: Dispute/Case detail (formerly “Transactions”) — reference for dispute case screen. [image:3]
- **Visual 4**: Login page — reference for initial login UI (stub only, no real auth yet). [image:4]

Use these strictly as visual guides; final implementation must match structure and style defined in existing project files (`styles.css`, `dashboard.component.html/ts`, `cases-list`, `sidebar`, etc.). [file:141b4905-6b50-434d-8a6a-cb89eb15e404][file:370052b4-4a68-43de-8bd6-ad49d777d4c2][file:a30cf72d-acbb-4b2f-934e-f3a2ae36ce11]

---

### SERVER & PORT HANDLING

1. Before any code changes:
   - Go to the terminal where Angular is running.
   - Press `Ctrl+C` until the prompt returns and there is no `ng serve` output.
2. Verify port 4200 is free (e.g. using OS tools or by confirming no Angular server is running).
3. After edits and `npm run build`, start dev server with:
   - `npm start`
   - If Angular asks to use another port because 4200 is in use, the answer is always **NO**; first stop the process using 4200 and restart.
4. Document any port-related issue with an `AG-LESSON` comment in a log or relevant config file.

---

### SIDE TAB / SIDEBAR REQUIREMENTS (FROM VISUAL 1)

- Left sidebar must exist and match Visual 1 behavior and structure:
  - Primary entries: Dashboard, Cases, Disputes (if applicable), Reports, Settings, Help, Logout.
  - Highlighted/active state as in Visual 1 for the current section.
- Sidebar must be part of the global layout shell so it appears on the main application screens (Dashboard, Cases, Reports, Disputes, etc.), not duplicated per-page.
- New items:
  - `New Case` (from Visual 2) as its own navigation entry.
  - `Dispute Case` (Visual 3) as the evolved “Transactions” / dispute view.
- Routes backing these entries must exist and render appropriate components:
  - `/cases/new` → New Case view (Visual 2).
  - `/disputes/:id` or similar → Dispute detail view (Visual 3).

---

### LOGIN PAGE (VISUAL 4, STUB ONLY)

- Implement a login page matching Visual 4’s layout and branding.
- Route:
  - `/login` → login component.
- Purpose:
  - UI only, with clear `Sign in` button and RPR VERIFY branding.
  - Stub out the auth method for future integration (no real Google Workspace wiring yet).
- Do **not** modify or break existing navigation/auth logic outside the agreed entry point routing; keep it simple and reversible.

---

### BUILD & VERIFICATION CHECKLIST

For every batch of changes:

1. Stop dev server (`Ctrl+C`).
2. Save all modified files in WebStorm.
3. Run `npm run build` and ensure it completes without errors.
4. Run `npm start` and confirm:
   - Server is at `http://localhost:4200/` only.
5. In the browser (without changing browser settings):
   - Confirm sidebar exists and behaves as in Visual 1.
   - Confirm New Case (Visual 2) and Dispute views (Visual 3) routes render.
   - Confirm login page (Visual 4) route renders.
6. If any discrepancy appears, fix it and add an `AG-LESSON` comment near the relevant code.

No deviations from this process are allowed.
