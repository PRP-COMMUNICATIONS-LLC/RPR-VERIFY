# 🤖 Copilot Local Testing Execution Guide

**Project:** RPR-VERIFY  
**Phase:** Tech Debt Modernization - Vitest Integration  
**Date:** December 16, 2025, 10:53 PM +08  
**Branch:** `feature/escalation-dashboard-ui`

---

## 📋 Overview

This guide provides step-by-step instructions for executing the complete test modernization workflow locally. All configuration files have been prepared and committed.

---

## ✅ Prerequisites Checklist

### Files Already Committed:
- ✅ `package.json` - Updated with `@angular/platform-browser-dynamic@^21.0.0`
- ✅ `src/test-setup.ts` - TestBed initialization with `ngDevMode` mock
- ✅ `angular.json` - Migrated to `@angular/build:unit-test` builder
- ✅ `tsconfig.spec.json` - Configured with Vitest types
- ✅ `src/testing/createMockDocument.ts` - Mock data utilities
- ✅ `src/app/app.component.spec.ts` - Modern Vitest test suite
- ✅ `src/app/services/auth.service.spec.ts` - Firebase Auth tests
- ✅ `src/app/services/escalation.service.spec.ts` - HTTP API tests
- ✅ `scripts/test-runner.sh` - Automated validation script

### Local Environment Requirements:
- Node.js v18+ (verified during script execution)
- npm v9+ (verified during script execution)
- Git (to pull latest changes)

---

## 🚀 Execution Steps

### Step 1: Pull Latest Changes

```bash
# Navigate to project root
cd /path/to/rpr-verify

# Ensure you're on the correct branch
git checkout feature/escalation-dashboard-ui

# Pull all committed test modernization files
git pull origin feature/escalation-dashboard-ui
```

**Expected Output:**
```
Updating 487ff4f..38389f2
Fast-forward
 COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md  | 350 +++++++++++++++
 scripts/test-runner.sh                       | 245 +++++++++++
 src/testing/createMockDocument.ts            | 290 ++++++++++++
 src/app/app.component.spec.ts               |  45 ++
 src/app/services/auth.service.spec.ts        |  82 ++++
 src/app/services/escalation.service.spec.ts  | 130 ++++++
 6 files changed, 1142 insertions(+)
```

---

### Step 2: Run Automated Test Runner

The `test-runner.sh` script performs comprehensive validation:

```bash
# Make script executable (first time only)
chmod +x scripts/test-runner.sh

# Execute test runner
./scripts/test-runner.sh
```

**What the Script Does:**

1. ✅ **Environment Validation** - Checks Node.js, npm, package.json
2. ✅ **Dependency Verification** - Validates all required packages
3. ✅ **Configuration Check** - Confirms all config files exist
4. ✅ **Baseline Test Run** - Executes `npm run test`
5. ✅ **Test File Discovery** - Scans for all `*.spec.ts` files
6. ✅ **Skipped Test Detection** - Identifies `.skip()` usage
7. ✅ **Individual Test Execution** - Tests each suite separately
8. ✅ **Final Report** - Summarizes pass/fail status

**Expected Success Output:**
```
========================================
  RPR-VERIFY Test Modernization Runner
========================================

[PHASE 1] Environment Validation
  ✓ Node.js: v20.11.0
  ✓ npm: 10.8.2
  ✓ package.json found
  ✓ node_modules exists

[PHASE 2] Critical Dependencies Check
  ✓ @angular/platform-browser-dynamic@21.0.0
  ✓ vitest@4.0.8
  ✓ jsdom@27.1.0

[PHASE 3] Configuration Files Validation
  ✓ src/test-setup.ts exists
    ✓ TestBed initialization found
  ✓ angular.json exists
    ✓ Vitest builder configured
  ✓ tsconfig.spec.json exists
    ✓ Vitest types configured

[PHASE 4] Baseline Test Execution
  ✓ Baseline test execution successful
    Test Files  3 passed (3)

[PHASE 5] Test File Discovery
  Found 3 test files:
    - src/app/app.component.spec.ts
    - src/app/services/auth.service.spec.ts
    - src/app/services/escalation.service.spec.ts

[PHASE 6] Skipped Test Detection
  ✓ No skipped tests found

[PHASE 7] Individual Test File Execution
Testing: src/app/app.component.spec.ts
  ✓ PASSED
Testing: src/app/services/escalation.service.spec.ts
  ✓ PASSED
Testing: src/app/services/auth.service.spec.ts
  ✓ PASSED

========================================
  Test Execution Summary
========================================

  Total Test Files: 3
  Passed: 3
  Failed: 0

✓ All tests passed successfully!

Next steps:
  1. Review COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md
  2. Proceed to Step 3: Restore Legacy Tests
  3. Create src/testing/createMockDocument.ts
```

---

### Step 3: Manual Test Execution (Alternative)

If you prefer to run tests manually:

```bash
# Install dependencies
npm install

# Run all tests
npm run test

# Run specific test file
npm run test -- src/app/app.component.spec.ts

# Run tests in watch mode (for development)
npm run test:watch
```

---

## 🔍 Troubleshooting

### Error: `TestBed is not initialized`

**Symptoms:**
```
Error: TestBed is not initialized. Call TestBed.initTestEnvironment() first.
```

**Solution:**
```bash
# Verify src/test-setup.ts exists and contains TestBed.initTestEnvironment
cat src/test-setup.ts | grep "TestBed.initTestEnvironment"

# If missing, the file was not pulled correctly
git pull origin feature/escalation-dashboard-ui --force
```

---

### Error: `Cannot find module '@angular/platform-browser-dynamic/testing'`

**Symptoms:**
```
Error: Cannot find module '@angular/platform-browser-dynamic/testing'
```

**Solution:**
```bash
# Verify package is listed in package.json
cat package.json | grep "platform-browser-dynamic"

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

### Error: `zone.js/testing is not defined`

**Symptoms:**
```
ReferenceError: Zone is not defined
```

**Solution:**
```bash
# Ensure zone.js is installed
npm install zone.js@^0.16.0 --save

# Verify import in src/test-setup.ts
head -1 src/test-setup.ts
# Should output: import 'zone.js/testing';
```

---

### Error: Tests pass but with warnings

**Symptoms:**
```
Warning: Some tests passed but skipped tests detected
```

**Solution:**
```bash
# Search for .skip() usage
grep -r "\.skip(" src/**/*.spec.ts

# Remove .skip() from test suites per COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md Phase 2
```

---

## 📊 Success Metrics

### Minimum Acceptable:
- ✅ `npm install` completes without errors
- ✅ `npm run test` passes with 0 failures
- ✅ At least 3 test files execute successfully

### Target Goal:
- ✅ All test files pass (app, auth service, escalation service)
- ✅ 10+ individual test cases pass
- ✅ Zero linting errors in test files
- ✅ Test execution time < 10 seconds

---

## 🎯 Next Phase: ESLint Modernization

Once all tests pass, proceed to:

### Step 4: Run ESLint Analysis

```bash
# Check for linting errors
npm run lint

# Auto-fix fixable issues
npm run lint:fix
```

### Expected Lint Issues to Address:

1. **Type Safety (`any` usage)**
   - Replace `any` with specific types
   - Example: `data: any` → `data: DocumentData`

2. **Control Flow Migration**
   - Replace `*ngIf` with `@if`
   - Replace `*ngFor` with `@for`

3. **Unused Imports**
   - Remove unused imports flagged by ESLint

---

## 📁 Generated Artifacts

After successful execution:

```
rpr-verify/
├── test-output.log          # Full test execution log
├── node_modules/            # Installed dependencies
└── src/
    └── testing/
        └── createMockDocument.ts  # Mock utilities (already committed)
```

---

## 🔗 Related Documentation

- [COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md](./COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md) - Detailed restoration instructions
- [scripts/test-runner.sh](./scripts/test-runner.sh) - Automated test execution script
- [Vitest Angular Migration Guide](https://angular.dev/guide/testing/migrating-to-vitest)
- [Video Tutorial](https://www.youtube.com/watch?v=oMzVtCKsLRc) - Angular 21 Vitest migration

---

## 📞 Support

If tests fail after following this guide:

1. Check `test-output.log` for detailed errors
2. Verify all commits are pulled: `git log --oneline -5`
3. Confirm Node.js version: `node -v` (should be v18+)
4. Review troubleshooting section above

---

**Last Updated:** December 16, 2025  
**Status:** Ready for Execution  
**Branch:** `feature/escalation-dashboard-ui`
