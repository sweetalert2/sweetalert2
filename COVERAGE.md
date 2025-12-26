# Code Coverage Setup

This repository has code coverage infrastructure set up using:
- `@cypress/code-coverage` for Cypress test coverage collection
- `nyc` for coverage reporting
- `k1LoW/octocov-action` for PR comments

## Current Status

The infrastructure is in place but NOT yet fully functional due to technical limitations:

### Issue
The source code needs to be instrumented for coverage to be collected. The tests import ES modules directly from `src/**/*.js`, which means instrumentation must happen before the browser loads these modules.

### Attempted Solutions
1. **Vite preprocessor** (`cypress-vite`): Successfully instruments code and generates coverage data, BUT breaks 185 out of 271 tests due to how Vite bundles/transforms modules.
2. **Direct instrumentation**: Would require changing test imports or pre-instrumenting files, which requires significant changes.

### Next Steps
To make code coverage fully functional, one of these approaches needs to be implemented:
1. Fix the Vite preprocessor configuration to not break tests
2. Refactor tests to use a build that includes instrumentation
3. Use a different instrumentation approach compatible with direct ES module imports

## Configuration Files

- `.nycrc` - nyc configuration
- `.octocov.yml` - octocov configuration  
- `vite.config.mjs` - Vite with istanbul plugin (for future use)
- `.babelrc` - Babel with istanbul plugin (for future use)
- `cypress.config.mjs` - Cypress with code-coverage task
- `cypress/support/index.js` - Imports code-coverage support

## Usage

Currently, running tests with `bun run test` will generate an empty coverage report (files listed but no data).

To test coverage WITH instrumentation (note: tests will fail):
```bash
# Install cypress-vite and configure it in cypress.config.mjs
COVERAGE=true bun run test --browser chrome
```

This will generate `coverage/lcov.info` with actual coverage data, but 185 tests will fail.
