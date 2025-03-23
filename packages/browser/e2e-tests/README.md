# @stlite/browser E2E Tests

This directory contains end-to-end tests for the `@stlite/browser` package using Playwright.

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

## Adding New Tests

To add a new test:

1. Create a new HTML file in the `pages` directory
2. Create a new test file in the `tests` directory
3. Use the existing tests as a template for your new test
