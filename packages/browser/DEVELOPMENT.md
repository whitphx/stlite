## Development

### Building

```bash
yarn build
```

### Testing

#### Unit Tests

```bash
yarn test
```

#### End-to-End Tests

The package includes end-to-end tests that verify the functionality of the built package in a real browser environment. The tests use Playwright to run a browser and interact with the Streamlit app.

To set up the E2E test environment:

```bash
yarn test:e2e:setup
```

To run the E2E tests:

```bash
yarn test:e2e
```

To run the E2E tests with the browser UI visible:

```bash
yarn test:e2e:headed
```

To run the E2E tests with the Playwright UI:

```bash
yarn test:e2e:ui
```

For more details, see the [E2E tests README](./e2e-tests/README.md).
