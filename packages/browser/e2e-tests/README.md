# @stlite/browser E2E Tests

This directory contains end-to-end tests for the `@stlite/browser` package using Playwright.

## Test Structure

The tests are organized as follows:

- `test-app.html`: A simple Streamlit app that uses the basic mount API
- `test-app-advanced.html`: A more complex app that uses matplotlib and demonstrates the advanced mount API options
- `test-app-custom-element.html`: An app that demonstrates the custom element API

The test files in the `tests` directory correspond to each of these test apps:

- `basic.spec.ts`: Tests for the basic app
- `advanced.spec.ts`: Tests for the advanced app
- `custom-element.spec.ts`: Tests for the custom element app

## Setup

Before running the tests, you need to install the dependencies:

```bash
# Navigate to the e2e-tests directory
cd packages/browser/e2e-tests

# Install dependencies
yarn install

# Install Playwright browsers
yarn install:browsers
```

## Running Tests

To run the tests:

```bash
# Run all tests
yarn test

# Run tests with browser UI visible
yarn test:headed

# Run tests with Playwright UI
yarn test:ui
```

## How the Tests Work

The tests use Playwright to:

1. Start two local HTTP servers:
   - One server (port 8080) serves the test HTML files
   - Another server (port 8081) serves the build artifacts (stlite.js, style.css, etc.)
2. Open the test pages in a browser
3. Verify that the Streamlit app loads correctly
4. Interact with the app to test its functionality
5. Verify that the app responds correctly to interactions

This setup simulates a real-world scenario where the Stlite library is served from a CDN or another domain, while the HTML files that use the library are served from a different location.

The tests are designed to be robust and handle the asynchronous nature of Streamlit apps loading in the browser.

## Adding New Tests

To add a new test:

1. Create a new HTML file in the `e2e-tests` directory
2. Create a new test file in the `tests` directory
3. Use the existing tests as a template for your new test
