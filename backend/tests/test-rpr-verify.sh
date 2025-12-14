#!/bin/bash
# RPR-VERIFY Test Suite
# Tests the RPR-VERIFY document processing service with real KYC documents

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/test-config.json"
INVENTORY_FILE="${SCRIPT_DIR}/test-document-inventory.json"
TEST_DOCS_DIR="${SCRIPT_DIR}/test-documents"
RESULTS_DIR="${SCRIPT_DIR}/test-results-$(date +%Y%m%d-%H%M%S)"
REPORT_FILE="${RESULTS_DIR}/test-report.md"

# Parse arguments
QUICK_MODE=false
VERBOSE=false
DOCUMENT_CATEGORY=""
HEALTH_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --quick)
            QUICK_MODE=true
            HEALTH_ONLY=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --document)
            DOCUMENT_CATEGORY="$2"
            shift 2
            ;;
        --health)
            HEALTH_ONLY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Load configuration
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: Config file not found: $CONFIG_FILE${NC}"
    exit 1
fi

SERVICE_URL=$(jq -r '.service.url' "$CONFIG_FILE")
TIMEOUT=$(jq -r '.test_settings.timeout' "$CONFIG_FILE")
RETRY_COUNT=$(jq -r '.test_settings.retry_count' "$CONFIG_FILE")

# Create results directory
mkdir -p "$RESULTS_DIR"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((TESTS_PASSED++))
    ((TESTS_TOTAL++))
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((TESTS_FAILED++))
    ((TESTS_TOTAL++))
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test: Health Check (REG-001)
test_health_check() {
    log_info "Running health check (REG-001)..."
    
    local response
    local status_code
    
    response=$(curl -s -w "\n%{http_code}" --max-time "$TIMEOUT" "${SERVICE_URL}/health" || echo "000")
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "200" ]; then
        log_success "Health check passed (REG-001)"
        if [ "$VERBOSE" = true ]; then
            echo "$response_body" | jq .
        fi
        return 0
    else
        log_error "Health check failed (REG-001) - Status: $status_code"
        echo "$response_body"
        return 1
    fi
}

# Test: Document Upload and Analysis
test_document() {
    local doc_file="$1"
    local doc_name=$(basename "$doc_file")
    local doc_category="$2"
    
    log_info "Testing document: $doc_name (Category: $doc_category)"
    
    # Convert image to base64
    if [ ! -f "$doc_file" ]; then
        log_error "Document not found: $doc_file"
        return 1
    fi
    
    local base64_data=$(base64 -i "$doc_file" | tr -d '\n')
    
    # Prepare request payload
    local payload=$(jq -n \
        --arg base64 "$base64_data" \
        '{base64: $base64}')
    
    # Make API call
    local start_time=$(date +%s)
    local response
    local status_code
    
    response=$(curl -s -w "\n%{http_code}" \
        --max-time "$TIMEOUT" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "${SERVICE_URL}/analyze" || echo "000")
    
    local end_time=$(date +%s)
    local processing_time=$((end_time - start_time))
    
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    # Save response to file
    echo "$response_body" | jq . > "${RESULTS_DIR}/${doc_name}.json" 2>/dev/null || echo "$response_body" > "${RESULTS_DIR}/${doc_name}.json"
    
    if [ "$status_code" = "200" ]; then
        # Validate response structure
        local status=$(echo "$response_body" | jq -r '.status // "error"' 2>/dev/null)
        
        if [ "$status" = "success" ]; then
            log_success "Document processed: $doc_name (${processing_time}s)"
            
            if [ "$VERBOSE" = true ]; then
                echo "$response_body" | jq .
            fi
            
            # Check processing time
            local expected_time=$(jq -r ".expected_processing_time.${doc_category} // 30" "$CONFIG_FILE")
            if [ "$processing_time" -gt "$expected_time" ]; then
                log_warning "Processing time (${processing_time}s) exceeds expected (${expected_time}s)"
            fi
            
            return 0
        else
            log_error "Document processing failed: $doc_name - Status: $status"
            echo "$response_body" | jq . 2>/dev/null || echo "$response_body"
            return 1
        fi
    else
        log_error "API call failed: $doc_name - HTTP $status_code"
        echo "$response_body"
        return 1
    fi
}

# Test: Negative Cases
test_negative_cases() {
    log_info "Running negative test cases..."
    
    # Test 1: Invalid file format (NEG-001)
    log_info "Test NEG-001: Invalid file format"
    local invalid_file="${TEST_DOCS_DIR}/invalid/test.txt"
    if [ -f "$invalid_file" ]; then
        local base64_data=$(base64 -i "$invalid_file" | tr -d '\n')
        local payload=$(jq -n --arg base64 "$base64_data" '{base64: $base64}')
        
        local response=$(curl -s -w "\n%{http_code}" \
            --max-time "$TIMEOUT" \
            -X POST \
            -H "Content-Type: application/json" \
            -d "$payload" \
            "${SERVICE_URL}/analyze" || echo "000")
        
        local status_code=$(echo "$response" | tail -n1)
        
        if [ "$status_code" = "400" ] || [ "$status_code" = "500" ]; then
            log_success "NEG-001: Correctly rejected invalid file format"
        else
            log_error "NEG-001: Should reject invalid file format (got $status_code)"
        fi
    fi
    
    # Test 2: Missing base64 field (NEG-002)
    log_info "Test NEG-002: Missing base64 field"
    local payload='{}'
    local response=$(curl -s -w "\n%{http_code}" \
        --max-time "$TIMEOUT" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "${SERVICE_URL}/analyze" || echo "000")
    
    local status_code=$(echo "$response" | tail -n1)
    
    if [ "$status_code" = "400" ]; then
        log_success "NEG-002: Correctly rejected missing base64 field"
    else
        log_error "NEG-002: Should reject missing base64 field (got $status_code)"
    fi
}

# Main test execution
main() {
    echo -e "${BOLD}${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           RPR-VERIFY Test Suite                             ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Health check
    if ! test_health_check; then
        log_error "Service is not available. Exiting."
        exit 1
    fi
    
    if [ "$HEALTH_ONLY" = true ]; then
        echo -e "\n${GREEN}Health check complete. Exiting (--quick mode).${NC}"
        exit 0
    fi
    
    # Load inventory and test documents
    if [ ! -f "$INVENTORY_FILE" ]; then
        log_error "Inventory file not found: $INVENTORY_FILE"
        exit 1
    fi
    
    # Test each document
    local docs_to_test=$(jq -r '.test_documents[] | select(.category == "'"$DOCUMENT_CATEGORY"'") | .filename' "$INVENTORY_FILE" 2>/dev/null)
    
    if [ -z "$docs_to_test" ] && [ -n "$DOCUMENT_CATEGORY" ]; then
        log_warning "No documents found for category: $DOCUMENT_CATEGORY"
        docs_to_test=""
    fi
    
    if [ -z "$docs_to_test" ]; then
        docs_to_test=$(jq -r '.test_documents[].filename' "$INVENTORY_FILE")
    fi
    
    echo ""
    log_info "Testing ${#docs_to_test[@]} document(s)..."
    
    while IFS= read -r doc_filename; do
        [ -z "$doc_filename" ] && continue
        
        # Find document in appropriate category directory
        local doc_path=""
        local doc_category=$(jq -r ".test_documents[] | select(.filename == \"$doc_filename\") | .category" "$INVENTORY_FILE")
        
        # Search in category-specific directories
        for category_dir in identity proof-of-address business; do
            if [ -f "${TEST_DOCS_DIR}/${category_dir}/${doc_filename}" ]; then
                doc_path="${TEST_DOCS_DIR}/${category_dir}/${doc_filename}"
                break
            fi
        done
        
        if [ -z "$doc_path" ]; then
            log_error "Document not found: $doc_filename"
            continue
        fi
        
        test_document "$doc_path" "$doc_category"
        echo ""
    done <<< "$docs_to_test"
    
    # Negative tests
    if [ -z "$DOCUMENT_CATEGORY" ]; then
        echo ""
        test_negative_cases
    fi
    
    # Generate summary
    echo ""
    echo -e "${BOLD}${BLUE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}Test Summary${NC}"
    echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
    echo -e "Total Tests: ${TESTS_TOTAL}"
    echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
    echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"
    echo -e "Results saved to: ${RESULTS_DIR}"
    echo ""
    
    # Generate report
    {
        echo "# RPR-VERIFY Test Report"
        echo "Generated: $(date)"
        echo ""
        echo "## Summary"
        echo "- Total Tests: ${TESTS_TOTAL}"
        echo "- Passed: ${TESTS_PASSED}"
        echo "- Failed: ${TESTS_FAILED}"
        echo ""
        echo "## Results Directory"
        echo "All test results saved to: \`${RESULTS_DIR}\`"
    } > "$REPORT_FILE"
    
    if [ "$TESTS_FAILED" -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Check dependencies
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed.${NC}"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is required but not installed.${NC}"
    exit 1
fi

# Run main
main "$@"

