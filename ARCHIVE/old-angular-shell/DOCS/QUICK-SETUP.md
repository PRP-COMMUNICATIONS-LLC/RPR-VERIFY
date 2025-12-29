# RPR-VERIFY-V1: Quick Setup Checklist

**Date:** 2025-12-23  
**Action:** Integrate corrected MainLayoutComponent files  
**Target:** rpr-verify-b Angular project

---

## ✅ Files to Download

1. **variables.scss** — Design variables (create at `src/styles/variables.scss`)
2. **main-layout.component.ts** — CORRECTED TypeScript (replace `src/app/core/layout/main-layout.component.ts`)
3. **main-layout.component.html** — CORRECTED template (replace `src/app/core/layout/main-layout.component.html`)
4. **main-layout.component.scss** — CORRECTED styles (replace `src/app/core/layout/main-layout.component.scss`)
5. **INTEGRATION-GUIDE.md** — Full integration instructions
6. **GEMINI-SYSTEM-INSTRUCTIONS.md** — Backend/Frontend execution rules (for Gemini agent)

---

## 🚀 Quick Steps

### 1. Backup Existing Files
```bash
cp src/app/core/layout/main-layout.component.ts src/app/core/layout/main-layout.component.ts.backup
cp src/app/core/layout/main-layout.component.html src/app/core/layout/main-layout.component.html.backup
cp src/app/core/layout/main-layout.component.scss src/app/core/layout/main-layout.component.scss.backup
```

### 2. Copy Design Variables
```bash
mkdir -p src/styles
cp variables.scss src/styles/variables.scss
```

### 3. Copy Component Files
```bash
cp main-layout.component.ts src/app/core/layout/
cp main-layout.component.html src/app/core/layout/
cp main-layout.component.scss src/app/core/layout/
```

### 4. Verify Routing
Confirm your routing module includes these routes:
```typescript
const routes = [
  { path: 'upload', component: SecureUploadComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'verification', component: VerificationComponent },
  { path: 'resolution', component: ResolutionComponent }
];
```

### 5. Build & Test
```bash
npm ci
ng build --configuration production
ng serve
```

**Expected:** No build errors, app loads at `localhost:4200`.

---

## 🔍 What Was Fixed

| Issue | Fix |
|-------|-----|
| Route check | Changed `/disputes` → `/resolution` |
| SCSS imports | Added inline variable definitions in component styles |
| Template structure | Added RouterOutlet and corrected routerLink attributes |
| Header height | Set to 90px (increased from ~60px) |
| Nav gaps | Set to 40px (wider spacing) |
| Red accent | Applied to RESOLUTION tab only when active |

---

## ⚠️ Important Notes

- **Route paths:** If your app uses different route names, update `routerLink` attributes in the template
- **Logo SVG:** The triangle icon uses a basic SVG. Replace with your actual logo if needed
- **Styles scope:** All SCSS variables are now defined in the component file (or in `src/styles/variables.scss`)
- **No external dependencies:** Uses Angular built-ins only (Router, CommonModule)

---

## 📋 Validation After Integration

- [ ] Build passes: `ng build --configuration production`
- [ ] Tests pass: `npm run test`
- [ ] Dev server runs: `ng serve` (localhost:4200)
- [ ] Header displays correctly (logo, nav tabs visible)
- [ ] Tabs are clickable and navigate
- [ ] RESOLUTION tab turns red when active
- [ ] No console errors (F12 → Console)

---

## 💬 Backend Integration Ready

Once frontend is stable:
1. Ensure Flask backend runs on `localhost:8080`
2. Wire SecureUploadComponent to POST `/api/v1/slips/scan`
3. Wire EscalationDashboardComponent to GET `/api/v1/cases/{caseId}`
4. Verify CORS headers allow `localhost:4200`

See **GEMINI-SYSTEM-INSTRUCTIONS.md** for full backend integration roadmap.

---

**Status:** Ready for download and integration  
**Next Step:** Copy files, run build verification, test in browser
