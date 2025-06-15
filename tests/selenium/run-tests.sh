#!/bin/bash

# Selenium Test Runner for Connect Aid
# Integrates with existing CI/CD pipeline

set -e

echo "Starting Selenium Tests for Connect Aid"
echo "=========================================="

# Environment variables
export TEST_BASE_URL=${TEST_BASE_URL:-"http://nginx:80"}
export CI=${CI:-"true"}
export NODE_ENV="test"

echo "Test Configuration:"
echo "  Base URL: $TEST_BASE_URL"
echo "  CI Mode: $CI"
echo "  Chrome Version: $(chromium-browser --version)"
echo "  ChromeDriver Version: $(chromedriver --version)"

# Verify ChromeDriver can start
echo "Verifying ChromeDriver setup..."
chromedriver --version
if [ $? -eq 0 ]; then
    echo "ChromeDriver is properly installed"
else
    echo "ChromeDriver verification failed"
    exit 1
fi

# Create results directory
mkdir -p test-results screenshots

# Function to cleanup on exit
cleanup() {
    echo "Cleaning up test artifacts..."
    # Kill any remaining Chrome processes
    pkill -f chromium || true
    pkill -f chrome || true
    pkill -f chromedriver || true
}

# Set trap for cleanup
trap cleanup EXIT

# Wait for application to be ready (following Jenkins pattern)
echo "Waiting for application to be ready..."
for i in {1..10}; do
    if curl -f "$TEST_BASE_URL/api/health" >/dev/null 2>&1; then
        echo "Application is ready!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "Application failed to start after 10 attempts"
        exit 1
    fi
    echo "  Attempt $i/10 failed, waiting 5 seconds..."
    sleep 5
done

# Run tests with timeout and detailed output
echo "Running Selenium Tests..."
if timeout 300 npm test -- --reporter spec --timeout 30000; then
    echo "All tests completed successfully!"
    
    # Generate summary if results exist
    if [ -f test-results/results.json ]; then
        echo "Test Summary:"
        echo "  Results saved to: test-results/results.json"
    fi
    
    echo "Test execution completed!"
else
    echo "Tests failed or timed out"
    
    # Show last few lines of Chrome logs if available
    if [ -f ~/.config/chromium/chrome_debug.log ]; then
        echo "Chrome Debug Logs (last 20 lines):"
        tail -20 ~/.config/chromium/chrome_debug.log
    fi
    
    # List any screenshots taken
    if [ -d screenshots ] && [ "$(ls -A screenshots)" ]; then
        echo "Screenshots captured:"
        ls -la screenshots/
    fi
    
    exit 1
fi 