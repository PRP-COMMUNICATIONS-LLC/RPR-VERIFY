#!/bin/bash

# RPR-VERIFY Test Runner Script
# Purpose: Automated test execution for Copilot-driven test modernization
# Date: December 16, 2025
# Branch: feature/escalation-dashboard-ui

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test result tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  RPR-VERIFY Test Modernization Runner${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Phase 1: Environment Check
echo -e "${YELLOW}[PHASE 1] Environment Validation${NC}"
echo ""

# Check Node version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v)
echo -e "  ✓ Node.js: ${NODE_VERSION}"

# Check npm version
NPM_VERSION=$(npm -v)
echo -e "  ✓ npm: ${NPM_VERSION}"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}  ✗ package.json not found!${NC}"
    exit 1
fi
echo -e "  ✓ package.json found"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  ⚠ node_modules not found. Running npm install...${NC}"
    npm install
else
    echo -e "  ✓ node_modules exists"
fi

echo ""

# Phase 2: Dependency Verification
echo -e "${YELLOW}[PHASE 2] Critical Dependencies Check${NC}"
echo ""

# Check for @angular/platform-browser-dynamic
if npm list @angular/platform-browser-dynamic > /dev/null 2>&1; then
    VERSION=$(npm list @angular/platform-browser-dynamic | grep @angular/platform-browser-dynamic | awk '{print $2}')
    echo -e "  ✓ @angular/platform-browser-dynamic@${VERSION}"
else
    echo -e "${RED}  ✗ @angular/platform-browser-dynamic not found!${NC}"
    echo -e "${YELLOW}    Installing...${NC}"
    npm install @angular/platform-browser-dynamic@^21.0.0 --save
fi

# Check for Vitest
if npm list vitest > /dev/null 2>&1; then
    VERSION=$(npm list vitest | grep vitest | awk '{print $2}')
    echo -e "  ✓ vitest@${VERSION}"
else
    echo -e "${RED}  ✗ Vitest not found!${NC}"
    exit 1
fi

# Check for jsdom
if npm list jsdom > /dev/null 2>&1; then
    VERSION=$(npm list jsdom | grep jsdom | awk '{print $2}')
    echo -e "  ✓ jsdom@${VERSION}"
else
    echo -e "${YELLOW}  ⚠ jsdom not found. Installing...${NC}"
    npm install jsdom --save-dev
fi

echo ""

# Phase 3: Configuration Validation
echo -e "${YELLOW}[PHASE 3] Configuration Files Validation${NC}"
echo ""

# Check src/test-setup.ts
if [ -f "src/test-setup.ts" ]; then
    echo -e "  ✓ src/test-setup.ts exists"
    if grep -q "TestBed.initTestEnvironment" src/test-setup.ts; then
        echo -e "    ✓ TestBed initialization found"
    else
        echo -e "${RED}    ✗ TestBed initialization missing!${NC}"
        exit 1
    fi
else
    echo -e "${RED}  ✗ src/test-setup.ts not found!${NC}"
    exit 1
fi

# Check angular.json
if [ -f "angular.json" ]; then
    echo -e "  ✓ angular.json exists"
    if grep -q "@angular/build:unit-test" angular.json; then
        echo -e "    ✓ Vitest builder configured"
    else
        echo -e "${YELLOW}    ⚠ Using legacy Karma builder${NC}"
    fi
else
    echo -e "${RED}  ✗ angular.json not found!${NC}"
    exit 1
fi

# Check tsconfig.spec.json
if [ -f "tsconfig.spec.json" ]; then
    echo -e "  ✓ tsconfig.spec.json exists"
    if grep -q '"vitest"' tsconfig.spec.json; then
        echo -e "    ✓ Vitest types configured"
    else
        echo -e "${YELLOW}    ⚠ Vitest types not found in tsconfig${NC}"
    fi
else
    echo -e "${RED}  ✗ tsconfig.spec.json not found!${NC}"
    exit 1
fi

echo ""

# Phase 4: Baseline Test Execution
echo -e "${YELLOW}[PHASE 4] Baseline Test Execution${NC}"
echo ""

echo "Running: npm run test"
echo "-------------------------------------"

if npm run test 2>&1 | tee test-output.log; then
    echo ""
    echo -e "${GREEN}  ✓ Baseline test execution successful${NC}"
    
    # Parse test results
    if grep -q "Test Files" test-output.log; then
        TEST_SUMMARY=$(grep "Test Files" test-output.log)
        echo -e "    ${TEST_SUMMARY}"
    fi
else
    echo ""
    echo -e "${RED}  ✗ Baseline test execution failed${NC}"
    echo -e "${YELLOW}  Check test-output.log for details${NC}"
    exit 1
fi

echo ""

# Phase 5: Test File Discovery
echo -e "${YELLOW}[PHASE 5] Test File Discovery${NC}"
echo ""

echo "Scanning for *.spec.ts files..."
SPEC_FILES=$(find src -name "*.spec.ts" -type f)
SPEC_COUNT=$(echo "$SPEC_FILES" | wc -l | tr -d ' ')

if [ "$SPEC_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}  ⚠ No spec files found${NC}"
else
    echo -e "  Found ${GREEN}${SPEC_COUNT}${NC} test files:"
    echo "$SPEC_FILES" | while read -r file; do
        echo "    - $file"
    done
fi

echo ""

# Phase 6: Skipped Test Detection
echo -e "${YELLOW}[PHASE 6] Skipped Test Detection${NC}"
echo ""

echo "Scanning for .skip() usage..."
SKIPPED=$(grep -r "\.skip(" src/**/*.spec.ts 2>/dev/null || true)

if [ -z "$SKIPPED" ]; then
    echo -e "  ${GREEN}✓ No skipped tests found${NC}"
else
    echo -e "  ${YELLOW}⚠ Found skipped tests:${NC}"
    echo "$SKIPPED" | while read -r line; do
        echo "    $line"
    done
    SKIPPED_TESTS=$(echo "$SKIPPED" | wc -l | tr -d ' ')
fi

echo ""

# Phase 7: Individual Test Execution
echo -e "${YELLOW}[PHASE 7] Individual Test File Execution${NC}"
echo ""

# Test app.spec.ts
if [ -f "src/app/app.spec.ts" ]; then
    echo "Testing: src/app/app.spec.ts"
    if npm run test -- src/app/app.spec.ts > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}✗ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

# Test escalation.service.spec.ts (if exists)
if [ -f "src/app/services/escalation.service.spec.ts" ]; then
    echo "Testing: src/app/services/escalation.service.spec.ts"
    if npm run test -- src/app/services/escalation.service.spec.ts > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}✗ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

# Test auth.service.spec.ts (if exists)
if [ -f "src/app/services/auth.service.spec.ts" ]; then
    echo "Testing: src/app/services/auth.service.spec.ts"
    if npm run test -- src/app/services/auth.service.spec.ts > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}✗ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

echo ""

# Phase 8: Final Report
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Execution Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "  Total Test Files: ${TOTAL_TESTS}"
echo -e "  ${GREEN}Passed: ${PASSED_TESTS}${NC}"
echo -e "  ${RED}Failed: ${FAILED_TESTS}${NC}"
if [ "$SKIPPED_TESTS" -gt 0 ]; then
    echo -e "  ${YELLOW}Skipped: ${SKIPPED_TESTS}${NC}"
fi
echo ""

# Success/Failure determination
if [ "$FAILED_TESTS" -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md"
    echo "  2. Proceed to Step 3: Restore Legacy Tests"
    echo "  3. Create src/testing/createMockDocument.ts"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check test-output.log for detailed errors"
    echo "  2. Verify TestBed configuration in src/test-setup.ts"
    echo "  3. Ensure all imports use explicit Vitest functions"
    echo "  4. Review COPILOT_INSTRUCTIONS_TEST_MODERNIZATION.md Phase 1"
    exit 1
fi
