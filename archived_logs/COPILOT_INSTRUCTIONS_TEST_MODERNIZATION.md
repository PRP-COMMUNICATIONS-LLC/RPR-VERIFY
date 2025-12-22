# 🤖 Copilot Test Modernization Instructions

**Date:** December 16, 2025, 10:48 PM +08  
**Branch:** `feature/escalation-dashboard-ui`  
**Phase:** Tech Debt Modernization - Testing Environment Setup  
**Executor:** GitHub Copilot Workspace / Local Development

---

## 📋 Context

The Escalation Dashboard has been successfully deployed to production. The next priority is **Tech Debt Modernization**, specifically migrating the testing infrastructure from deprecated Karma/Jasmine to Vitest (Angular 21 default).

### ✅ Completed Setup (Steps 1-2)

1. ✅ `package.json` updated with `@angular/platform-browser-dynamic@^21.0.0`
2. ✅ `src/test-setup.ts` created with TestBed initialization and `ngDevMode` mock
3. ✅ `angular.json` migrated from Karma to `@angular/build:unit-test` builder
4. ✅ `tsconfig.spec.json` configured with `"types": ["vitest"]`

### 🎯 Current Objective

**Verify the Vitest configuration works correctly** before restoring legacy component test suites.

---

## 🛠️ Phase 1: Installation & Verification

### Step 1: Install Dependencies

```bash
npm install
```

**Expected Outcome:**
- `@angular/platform-browser-dynamic@^21.0.0` installed successfully
- No peer dependency warnings related to Angular core packages
- `package-lock.json` updated

---

### Step 2: Run Test Suite (Baseline)

```bash
npm run test
```

**Current Configuration:**
```json
// package.json
"test": "vitest run --passWithNoTests"
```

**Expected Outcomes:**

✅ **SUCCESS Scenario:**
```
✓ Test Files  0 passed (0)
   Duration   < 1s

Tests passed (0)
```

⚠️ **FAILURE Scenarios & Resolutions:**

#### Error A: TestBed Initialization Failure
```
Error: TestBed is not initialized. Call TestBed.initTestEnvironment() first.
```

**Fix:** Verify `src/test-setup.ts` is correctly loaded by Vitest.

**Action:**
1. Check if Vitest is loading setup files properly
2. Create `vitest.config.ts` if missing:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false, // Use explicit imports
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
  },
});
```

3. Update `angular.json` test builder options:

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "runnerConfig": "vitest.config.ts"
  }
}
```

#### Error B: Missing Zone.js
```
Error: zone.js/testing is not defined
```

**Fix:** Ensure `zone.js` is installed and imported correctly.

**Action:**
```bash
npm install zone.js@^0.16.0 --save
```

Verify `src/test-setup.ts` imports:
```typescript
import 'zone.js/testing'; // Must be first import
```

#### Error C: Platform Browser Dynamic Not Found
```
Error: Cannot find module '@angular/platform-browser-dynamic/testing'
```

**Fix:** Confirm package installation.

**Action:**
```bash
npm list @angular/platform-browser-dynamic
# Should show: @angular/platform-browser-dynamic@21.0.0

# If missing:
npm install @angular/platform-browser-dynamic@^21.0.0 --save
```

---

## 🧪 Phase 2: Test Suite Restoration

**⚠️ DO NOT PROCEED UNTIL PHASE 1 PASSES ⚠️**

Once `npm run test` completes with `0 passed (0)` and **NO ERRORS**, proceed:

### Step 3: Identify Skipped Tests

```bash
# Search for .skip() usage in test files
grep -r "\.skip(" src/**/*.spec.ts
```

**Expected Output:**
```
src/app/app.component.spec.ts:  describe.skip('AppComponent', () => {
src/app/dashboard/dashboard.component.spec.ts:  it.skip('should render title', () => {
src/app/secure-upload/secure-upload.component.spec.ts:  describe.skip('File Upload', () => {
```

---

### Step 4: Create Mock Utility (Prerequisite)

**File:** `src/testing/createMockDocument.ts`

```typescript
import { InjectionToken } from '@angular/core';

export interface MockDocumentOptions {
  type: 'drivers-license' | 'passport' | 'bank-statement' | 'abn';
  quality?: 'good' | 'poor' | 'blurry';
  confidence?: number; // 0-100
  dpi?: number;
  hasRedFlags?: boolean;
}

export interface MockDocument {
  id: string;
  type: string;
  filename: string;
  uploadedAt: Date;
  quality: {
    dpi: number;
    contrast: number;
    blurScore: number;
  };
  ocrResult: {
    confidence: number;
    extractedText: string;
  };
  riskAssessment: {
    severity: 'GREEN' | 'YELLOW' | 'RED';
    flags: string[];
  };
}

export function createMockDocument(options: MockDocumentOptions): MockDocument {
  const baseDoc: MockDocument = {
    id: `mock-${Date.now()}`,
    type: options.type,
    filename: `${options.type}-sample.jpg`,
    uploadedAt: new Date(),
    quality: {
      dpi: options.dpi ?? (options.quality === 'poor' ? 120 : 300),
      contrast: options.quality === 'poor' ? 0.3 : 0.8,
      blurScore: options.quality === 'blurry' ? 50 : 200,
    },
    ocrResult: {
      confidence: options.confidence ?? 85,
      extractedText: 'Sample extracted text',
    },
    riskAssessment: {
      severity: options.hasRedFlags ? 'RED' : 'GREEN',
      flags: options.hasRedFlags ? ['Mismatch detected'] : [],
    },
  };

  return baseDoc;
}

// Firebase Auth Mock
export const MOCK_FIREBASE_USER = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
};

// Router Mock
export const MOCK_ACTIVATED_ROUTE = {
  snapshot: {
    paramMap: {
      get: (key: string) => 'mock-value',
    },
  },
};
```

**Commit:**
```bash
git add src/testing/createMockDocument.ts
git commit -m "test: add mock document utility for unit tests"
```

---

### Step 5: Restore Tests One-by-One

**Order of Restoration (Risk-Averse Approach):**

#### 5.1: Start with Passing Unit Test

```bash
# Verify existing passing test still works
npm run test -- src/app/services/document-quality-analyzer.spec.ts
```

**Expected:** ✅ All assertions pass

---

#### 5.2: Re-enable Root Component Test

**File:** `src/app/app.component.spec.ts`

**Action:**
1. Remove `.skip()` from `describe.skip('AppComponent', ...)`
2. Update imports to use explicit Vitest functions:

```typescript
// Add at top of file
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Standalone component
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
```

**Test:**
```bash
npm run test -- src/app/app.component.spec.ts
```

**Expected:** ✅ 1 test passes

**If Fails:** Document error, revert `.skip()`, proceed to next investigation phase.

---

#### 5.3: Re-enable Dashboard Component Tests

**File:** `src/app/dashboard/dashboard.component.spec.ts`

**Action:**
1. Remove `.skip()`
2. Add required imports:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ActivatedRoute } from '@angular/router';
import { MOCK_ACTIVATED_ROUTE } from '../../testing/createMockDocument';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: MOCK_ACTIVATED_ROUTE },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
```

**Test:**
```bash
npm run test -- src/app/dashboard/dashboard.component.spec.ts
```

---

#### 5.4: Re-enable Secure Upload Tests

**File:** `src/app/secure-upload/secure-upload.component.spec.ts`

**Action:**
1. Remove `.skip()`
2. Mock Firebase Auth service:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SecureUploadComponent } from './secure-upload.component';
import { Auth } from '@angular/fire/auth';
import { MOCK_FIREBASE_USER } from '../../testing/createMockDocument';

const mockAuth = {
  currentUser: MOCK_FIREBASE_USER,
};

describe('SecureUploadComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecureUploadComponent],
      providers: [
        { provide: Auth, useValue: mockAuth },
      ],
    }).compileComponents();
  });

  it('should handle file selection', () => {
    const fixture = TestBed.createComponent(SecureUploadComponent);
    const component = fixture.componentInstance;
    
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [mockFile] } };
    
    component.onFileSelected(event as any);
    
    expect(component.selectedFile).toBeTruthy();
  });
});
```

**Test:**
```bash
npm run test -- src/app/secure-upload/secure-upload.component.spec.ts
```

---

### Step 6: Run Full Test Suite

```bash
npm run test
```

**Success Criteria:**
```
✓ src/app/app.component.spec.ts (1)
✓ src/app/dashboard/dashboard.component.spec.ts (1) 
✓ src/app/secure-upload/secure-upload.component.spec.ts (1)
✓ src/app/services/document-quality-analyzer.spec.ts (3)

Test Files  4 passed (4)
Tests  6 passed (6)
Duration  < 5s
```

---

## 📊 Phase 3: Update Status Documentation

### Update `testing_eslint_modernization.md`

```markdown
| Step | Task | Status |
|------|------|--------|
| 1. Fix Test Environment | Install Angular Test Builders | ✅ |
| 2. Configure Test Setup | Update src/test-setup.ts | ✅ |
| 3. Restore Legacy Tests | Re-enable Component Suites | ✅ |
| 4. ESLint Modernization | Resolve `any` and Control Flow Errors | [ ] |
| 5. Final Verification | Run Full Test Suite | ✅ |
```

**Commit:**
```bash
git add testing_eslint_modernization.md
git commit -m "docs: mark Steps 1-3 complete in test modernization checklist"
```

---

## 🚨 Error Handling Protocol

### If Any Test Fails During Restoration:

1. **Capture Full Error Output:**
   ```bash
   npm run test -- [failing-test-file] > test-error-log.txt 2>&1
   ```

2. **Document Failure:**
   - Error message
   - Stack trace
   - Test file location
   - Expected vs. Actual behavior

3. **Revert Changes:**
   ```bash
   git checkout -- [failing-test-file]
   ```

4. **Create Issue:**
   - Title: `[Test Restoration] [Component Name] - [Error Summary]`
   - Label: `tech-debt`, `testing`
   - Assign to next agent for investigation

5. **Continue with Next Test:**
   - Do not block entire restoration on single failure
   - Skip problematic test, proceed to next in sequence

---

## ✅ Definition of Done

- [ ] `npm install` completes without errors
- [ ] `npm run test` passes with 0 failures
- [ ] All component `.spec.ts` files have `.skip()` removed
- [ ] `createMockDocument.ts` utility created and committed
- [ ] Minimum 4 test suites passing (app, dashboard, secure-upload, services)
- [ ] `testing_eslint_modernization.md` updated with ✅ for Steps 1-3
- [ ] All changes committed to `feature/escalation-dashboard-ui`
- [ ] No regressions in production deployment health

---

## 🔄 Handover to Next Agent

### Files Modified:
```
src/testing/createMockDocument.ts (new)
src/app/app.component.spec.ts (restored)
src/app/dashboard/dashboard.component.spec.ts (restored)
src/app/secure-upload/secure-upload.component.spec.ts (restored)
testing_eslint_modernization.md (status update)
vitest.config.ts (created if needed)
```

### Next Phase:
**Step 4: ESLint Modernization**
- Run `ng lint` to identify all linting errors
- Fix `any` type usage across codebase
- Migrate deprecated `*ngIf`/`*ngFor` to Angular 17+ block syntax (`@if`, `@for`)
- Run `ng lint --fix` for auto-fixable issues

---

**End of Instructions**
