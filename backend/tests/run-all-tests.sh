#!/bin/bash
# Master test runner for RPR-VERIFY
# Checks prerequisites, runs all tests, and generates summary report

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_SCRIPT="${SCRIPT_DIR}/test-rpr-verify.sh"
VALIDATE_SCRIPT="${SCRIPT_DIR}/validate-results.py"
REPORT_DIR="${SCRIPT_DIR}/test-reports"

# Check prerequisites
check_prerequisites() {
    echo -e "${BOLD}${BLUE}Checking prerequisites...${NC}"
    
    local missing=0
    
    # Check for required commands
    for cmd in curl jq python3; do
        if command -v "$cmd" &> /dev/null; then
            echo -e "${GREEN}✓${NC} $cmd installed"
        else
            echo -e "${RED}✗${NC} $cmd not found"
            ((missing++))
        fi
    done
    
    # Check for optional commands
    if command -v gcloud &> /dev/null; then
        echo -e "${GREEN}✓${NC} gcloud installed (optional)"
    else
        echo -e "${YELLOW}⚠${NC} gcloud not found (optional, for GCP testing)"
    fi
    
    if [ "$missing" -gt 0 ]; then
        echo -e "\n${RED}Error: Missing required dependencies.${NC}"
        echo "Install missing tools and try again."
        exit 1
    fi
    
    echo ""
}

# Setup environment
setup_environment() {
    echo -e "${BOLD}${BLUE}Setting up test environment...${NC}"
    
    # Create report directory
    mkdir -p "$REPORT_DIR"
    
    # Make scripts executable
    chmod +x "$TEST_SCRIPT" 2>/dev/null || true
    chmod +x "$VALIDATE_SCRIPT" 2>/dev/null || true
    
    echo -e "${GREEN}✓${NC} Environment ready"
    echo ""
}

# Run tests
run_tests() {
    echo -e "${BOLD}${BLUE}Running RPR-VERIFY tests...${NC}"
    echo ""
    
    # Run main test script
    if [ -f "$TEST_SCRIPT" ]; then
        "$TEST_SCRIPT" "$@"
        local test_exit_code=$?
    else
        echo -e "${RED}Error: Test script not found: $TEST_SCRIPT${NC}"
        exit 1
    fi
    
    return $test_exit_code
}

# Validate results
validate_results() {
    echo ""
    echo -e "${BOLD}${BLUE}Validating test results...${NC}"
    
    # Find latest results directory
    local latest_results=$(ls -td "${SCRIPT_DIR}"/test-results-* 2>/dev/null | head -n1)
    
    if [ -z "$latest_results" ]; then
        echo -e "${YELLOW}⚠${NC} No test results found to validate"
        return 0
    fi
    
    if [ -f "$VALIDATE_SCRIPT" ]; then
        python3 "$VALIDATE_SCRIPT" \
            "${SCRIPT_DIR}/test-document-inventory.json" \
            "$latest_results"
        local validate_exit_code=$?
    else
        echo -e "${YELLOW}⚠${NC} Validation script not found: $VALIDATE_SCRIPT"
        return 0
    fi
    
    return $validate_exit_code
}

# Generate summary
generate_summary() {
    echo ""
    echo -e "${BOLD}${BLUE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}Test Execution Complete${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    # Find latest results
    local latest_results=$(ls -td "${SCRIPT_DIR}"/test-results-* 2>/dev/null | head -n1)
    
    if [ -n "$latest_results" ]; then
        echo -e "Results directory: ${latest_results}"
        echo -e "Report file: ${latest_results}/test-report.md"
        echo ""
        
        # Count result files
        local result_count=$(find "$latest_results" -name "*.json" | wc -l | tr -d ' ')
        echo -e "Test result files: ${result_count}"
    fi
    
    echo ""
}

# Main execution
main() {
    echo -e "${BOLD}${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║        RPR-VERIFY Master Test Runner                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    check_prerequisites
    setup_environment
    run_tests "$@"
    local test_result=$?
    
    validate_results
    local validate_result=$?
    
    generate_summary
    
    # Exit with error if any tests failed
    if [ "$test_result" -ne 0 ] || [ "$validate_result" -ne 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main
main "$@"

