# 🔍 CURSOR VERIFICATION CHECKLIST

**Purpose:** Verify that features folder has been moved to app folder and all components are in place  
**Status:** Ready for Cursor to execute  
**Date:** 2025-12-23 22:16 UTC+8

---

## VERIFICATION TASKS FOR CURSOR

### Task 1: Verify Directory Structure

```bash
# Check that features folder exists in src/app/
ls -la src/app/features/

# Expected output:
# ✅ secure-upload/
# ✅ transactions/
# ✅ verification/
# ✅ resolution/

# If you see any of these NOT present, report immediately
```

### Task 2: Verify Each Component File

```bash
# Secure Upload Component
find src/app/features/secure-upload -name "*.component.ts" && echo "✅ secure-upload component found"

# Transactions Component
find src/app/features/transactions -name "*.component.ts" && echo "✅ transactions component found"

# Verification Component
find src/app/features/verification -name "*.component.ts" && echo "✅ verification component found"

# Resolution Component
find src/app/features/resolution -name "*.component.ts" && echo "✅ resolution component found"

# Report any MISSING components
```

### Task 3: Verify AppComponent Configuration

```bash
# Check that AppComponent is standalone and imports routing
find src/app -name "app.component.ts" -exec grep -l "standalone: true" {} \; && echo "✅ AppComponent is standalone"

# Check for RouterOutlet import
find src/app -name "app.component.ts" -exec grep "RouterOutlet" {} \; && echo "✅ RouterOutlet is imported"

# Check for MainLayoutComponent import
find src/app -name "app.component.ts" -exec grep "MainLayoutComponent" {} \; && echo "✅ MainLayoutComponent is imported"
```

### Task 4: Verify Routing Files (if installed)

```bash
# Check if new routing files are in place
ls -la src/app/app.routes.ts && echo "✅ app.routes.ts exists"
ls -la src/app/app.config.ts && echo "✅ app.config.ts exists"
ls -la src/main.ts && echo "✅ main.ts exists (updated)"

# If any files are MISSING, report the location
```

### Task 5: Verify Layout Component Files

```bash
# Check main layout component exists
ls -la src/app/core/layout/main-layout.component.ts && echo "✅ main-layout.component.ts found"
ls -la src/app/core/layout/main-layout.component.html && echo "✅ main-layout.component.html found"
ls -la src/app/core/layout/main-layout.component.scss && echo "✅ main-layout.component.scss found"

# Check variables file exists
ls -la src/styles/variables.scss && echo "✅ variables.scss found"
```

### Task 6: Quick Syntax Check (Optional)

```bash
# Check TypeScript syntax for key files
npx tsc --noEmit src/app/app.component.ts 2>&1 | grep "error" && echo "❌ Errors found in app.component.ts" || echo "✅ app.component.ts has valid syntax"

# Check app.routes.ts if it exists
test -f src/app/app.routes.ts && npx tsc --noEmit src/app/app.routes.ts 2>&1 | grep "error" && echo "❌ Errors in app.routes.ts" || echo "✅ app.routes.ts syntax OK"
```

---

## EXPECTED DIRECTORY STRUCTURE

After verification, structure should be:

```
src/app/
├── app.component.ts          (standalone with imports: [MainLayoutComponent, RouterOutlet])
├── app.routes.ts             (if installed - all 4 routes)
├── app.config.ts             (if installed - configuration)
├── core/
│   └── layout/
│       ├── main-layout.component.ts
│       ├── main-layout.component.html
│       └── main-layout.component.scss
├── features/
│   ├── secure-upload/
│   │   └── secure-upload.component.ts
│   ├── transactions/
│   │   └── transactions.component.ts
│   ├── verification/
│   │   └── verification.component.ts
│   └── resolution/
│       └── resolution.component.ts
└── ... (other files)

src/styles/
└── variables.scss

src/main.ts                   (if updated - uses bootstrapApplication with appConfig)
```

---

## REPORT TEMPLATE

When done, provide this report:

```markdown
# Cursor Verification Report

**Date:** [timestamp]  
**Status:** ✅ COMPLETE / ⚠️ PARTIAL / ❌ FAILED

## Directory Structure
- [ ] src/app/features/ folder exists
- [ ] secure-upload component found
- [ ] transactions component found
- [ ] verification component found
- [ ] resolution component found

## AppComponent
- [ ] AppComponent is standalone
- [ ] AppComponent imports RouterOutlet
- [ ] AppComponent imports MainLayoutComponent

## Routing Files
- [ ] app.routes.ts exists (if installed)
- [ ] app.config.ts exists (if installed)
- [ ] main.ts updated (if installed)

## Layout Components
- [ ] main-layout.component.ts found
- [ ] main-layout.component.html found
- [ ] main-layout.component.scss found
- [ ] variables.scss found

## Issues Found
[List any issues or missing files]

## Ready for Phase 2?
✅ YES / ⚠️ NEEDS ACTION / ❌ BLOCKED

## Notes
[Any additional observations]
```

---

## IF ISSUES FOUND

**If features folder is missing:**
- Check if it's in a different location (e.g., `src/features/` instead of `src/app/features/`)
- Check if files are in `src/` root level
- Look for any `*-OLD` or `*-backup` directories

**If components are missing:**
- Create stub components to unblock build
- Or run: `ng generate component features/[component-name]`

**If routing files not installed:**
- Copy from: `app.routes.ts`, `app.config.ts`, `main.ts`, `transactions.component.ts`
- Follow: `ROUTING-FIX-COMPLETE.md` installation guide

---

**Next Action:** After verification, proceed with Phase 2 (Dependencies & Build)

**Report to:** Perplexity Command with findings
