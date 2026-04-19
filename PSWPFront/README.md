# PSWPFront

PSWPFront is the React frontend for PSWP and now uses Vite as its build tool.

## Available Scripts

In the project directory, you can run:

### npm run dev

Starts the Vite development server.

### npm run build

Builds the app for production into the dist folder.

### npm run preview

Serves the production build locally for verification.

### npm test

Runs the Vitest test suite once.

Unit tests are located in:

tests/unit

### npm run test:ci

Runs Vitest in CI mode and outputs JUnit XML:

test-results/vitest/results.xml

### npm run test:e2e

Runs Playwright end-to-end tests locally.

E2E tests are located in:

tests/e2e

### npm run test:e2e:ci

Runs Playwright in CI mode and outputs JUnit XML:

test-results/playwright/results.xml

### npm run playwright:install

Installs Playwright browsers.

Use this on CI agents once before running E2E tests.

## Environment Variables

Create a local env file as needed and set the backend endpoint.

Example:

VITE_API_URL=http://localhost:5232

## Jenkins CI Example

Run in PSWPFront directory:

npm ci
npm run test:ci
npm run playwright:install
npm run test:e2e:ci

Publish JUnit reports from:

- test-results/vitest/results.xml
- test-results/playwright/results.xml

