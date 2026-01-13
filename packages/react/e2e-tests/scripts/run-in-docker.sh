#!/bin/bash
# Runs Playwright tests in a Docker container for consistent rendering.
# This script is used by both local development and CI.
#
# Usage:
#   ./scripts/run-in-docker.sh [playwright args...]
#
# Examples:
#   ./scripts/run-in-docker.sh                      # Run tests
#   ./scripts/run-in-docker.sh --update-snapshots   # Update snapshots

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"

# Get Playwright version from node_modules
PLAYWRIGHT_VERSION=$(node -p "require('$E2E_DIR/node_modules/@playwright/test/package.json').version")

echo "Using Playwright version: $PLAYWRIGHT_VERSION"
echo "Running Playwright in Docker container..."

# Determine if we're updating snapshots (affects mount mode)
UPDATING_SNAPSHOTS=false
for arg in "$@"; do
  if [ "$arg" = "--update-snapshots" ]; then
    UPDATING_SNAPSHOTS=true
    break
  fi
done

# Mount snapshots as read-write only when updating, read-only otherwise
if [ "$UPDATING_SNAPSHOTS" = true ]; then
  SNAPSHOTS_MOUNT="$E2E_DIR/snapshots:/app/snapshots"
else
  SNAPSHOTS_MOUNT="$E2E_DIR/snapshots:/app/snapshots:ro"
fi

# Run Playwright in Docker
# The Playwright Docker image includes browsers but we need to install:
# - @playwright/test: for the config file import and test runner
# - http-server: used by playwright.config.ts to serve the demo
docker run --rm \
  -v "$E2E_DIR/demo-dist:/app/demo-dist:ro" \
  -v "$E2E_DIR/tests:/app/tests:ro" \
  -v "$E2E_DIR/test-utils.ts:/app/test-utils.ts:ro" \
  -v "$E2E_DIR/playwright.config.ts:/app/playwright.config.ts:ro" \
  -v "$SNAPSHOTS_MOUNT" \
  -v "$E2E_DIR/test-results:/app/test-results" \
  -v "$E2E_DIR/blob-report:/app/blob-report" \
  -w /app \
  --ipc=host \
  "mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}" \
  /bin/bash -c "
    npm install @playwright/test@${PLAYWRIGHT_VERSION} http-server &&
    npx playwright test --config=playwright.config.ts $*
  "
