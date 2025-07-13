# Tests

This directory contains all the test files for the application.

## Structure

- `e2e/` - End-to-end tests (if applicable)
- `unit/` - Unit tests
- `integration/` - Integration tests
- `setup/` - Test setup and utilities
- `fixtures/` - Test fixtures and mock data
- `playwright-report/` - Test execution reports (automatically generated)
- `test-results/` - Test output and artifacts (automatically generated)

## Running Tests

To run all tests:

```bash
npm test
```

To run specific test files:

```bash
npx playwright test tests/landing-page.spec.ts
```

## Writing Tests

- Follow the existing test structure and patterns
- Keep tests focused and independent
- Use descriptive test names
- Mock external dependencies
- Clean up after tests

## Best Practices

- Test behavior, not implementation
- Follow the Arrange-Act-Assert pattern
- Keep tests fast and reliable
- Use appropriate test data
- Document complex test scenarios
