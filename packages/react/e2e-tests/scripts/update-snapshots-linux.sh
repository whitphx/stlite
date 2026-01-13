#!/bin/bash
# Script to generate/update Playwright snapshots in a Linux environment using Docker.
# This ensures snapshots match CI (which runs on Linux).

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_DIR="$(dirname "$SCRIPT_DIR")"

# Get actual installed Playwright version from node_modules
PLAYWRIGHT_VERSION=$(node -p "require('$E2E_DIR/node_modules/@playwright/test/package.json').version")

echo "Using Playwright version: $PLAYWRIGHT_VERSION"

# Run Playwright in Docker to update snapshots
# The Playwright Docker image includes browsers but we need to install:
# - @playwright/test: for the config file import and test runner
# - http-server: used by playwright.config.ts to serve the demo
echo "Updating snapshots in Linux Docker container..."
docker run --rm \
  -v "$E2E_DIR/demo-dist:/app/demo-dist:ro" \
  -v "$E2E_DIR/tests:/app/tests:ro" \
  -v "$E2E_DIR/test-utils.ts:/app/test-utils.ts:ro" \
  -v "$E2E_DIR/playwright.config.ts:/app/playwright.config.ts:ro" \
  -v "$E2E_DIR/snapshots:/app/snapshots" \
  -w /app \
  --ipc=host \
  "mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}" \
  /bin/bash -c "
    npm install @playwright/test@${PLAYWRIGHT_VERSION} http-server &&
    npx playwright test --update-snapshots --config=playwright.config.ts
  "

echo "Done! Linux snapshots have been updated."
