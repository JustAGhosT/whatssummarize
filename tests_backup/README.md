# Test Suite

This directory contains all automated tests, test utilities, and configurations for the WhatsApp Conversation Summarizer project.

## Directory Structure

```
tests/
├── e2e/               # End-to-end tests using Playwright
├── unit/              # Unit tests for individual components and utilities
├── integration/       # Integration tests across multiple components
├── performance/       # Performance and load testing
├── security/          # Security tests and vulnerability scanning
├── __config__/        # Test framework configurations (Jest, Playwright, etc.)
├── __scripts__/       # Test utilities, helpers, and setup scripts
├── __mocks__/         # Global mock implementations
├── __fixtures__/      # Test data and static fixtures
├── __coverage__/      # Test coverage reports (generated)
├── __snapshots__/     # Test snapshots (generated)
└── test-runner.js     # Custom test runner
```

## Running Tests

### Run All Tests
```bash
npm test
# or
npm run test:all
```

### Run Specific Test Types
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (requires server running)
npm run test:e2e

# Performance tests
npm run test:performance

# Security tests
npm run test:security

# Run with coverage
npm run test:coverage

# Update snapshots
npm run test:update
```

### Development Workflow

```bash
# Watch mode for unit tests
npm run test:unit -- --watch

# Run a specific test file
npm run test:unit -- path/to/test-file.test.ts

# Run tests matching a pattern
npm run test:unit -- -t "test description pattern"
```

## Directory Naming Convention

- `__config__/` - Test framework configurations (Jest, Playwright, etc.)
- `__scripts__/` - Test utilities, helpers, and setup scripts
- `__mocks__/` - Global mock implementations
- `__fixtures__/` - Test data and static fixtures
- `__coverage__/` - Test coverage reports (generated)
- `__snapshots__/` - Test snapshots (generated)

This convention helps visually separate test infrastructure from actual test implementations.

## Test Guidelines

- Place all test files next to the code they test with a `.test.ts` or `.spec.ts` extension
- Use `__mocks__` for module mocks that should be available globally
- Store test data in `__fixtures__` when it's shared across multiple tests
- Keep test utilities in `__scripts__`
- Update snapshots when intentional changes are made to component output

## CI/CD Integration

Tests are automatically run in CI on every push and pull request. The pipeline includes:

1. Linting and type checking
2. Unit and integration tests
3. E2E tests
4. Coverage reporting
5. Security scanning

## Coverage Requirements

- Statements: 80% minimum
- Branches: 70% minimum
- Functions: 80% minimum
- Lines: 80% minimum

## Test Runner

The custom test runner (`test-runner.js`) provides a unified way to run all test types with proper sequencing and error handling. It will:

1. Run unit, component, and integration tests
2. Start the development server if needed
3. Run E2E tests
4. Clean up resources

## Writing Tests

### Unit Tests
- Test individual functions and pure logic
- Mock all external dependencies
- Keep tests fast and focused

### Component Tests
- Test React components in isolation
- Use `@testing-library/react`
- Test user interactions and component output

### Integration Tests
- Test interactions between components/modules
- Mock only external services
- Test data flow and state management

### E2E Tests
- Test critical user flows
- Use Page Object Model pattern
- Run against a real or mocked backend

## Best Practices

### General
- Follow the Arrange-Act-Assert pattern
- Test behavior, not implementation
- Keep tests independent and isolated
- Use descriptive test names

### Test Data
- Use factories for test data
- Keep test data close to tests
- Use TypeScript types for test data

### Performance
- Keep tests fast (ideally < 5s for unit tests)
- Use `test.concurrent` for independent tests
- Mock expensive operations

### Maintenance
- Update tests when features change
- Remove or update flaky tests
- Document complex test scenarios

## Debugging Tests

### Jest Debugging
```bash
# Run in watch mode with debug output
npm test -- --watch --verbose

# Debug a specific test file
node --inspect-brk node_modules/.bin/jest --runInBand tests/unit/example.test.ts
```

### Playwright Debugging
```bash
# Run in headed mode
npx playwright test --headed

# Debug a specific test
npx playwright test tests/e2e/example.spec.ts --debug
```

## CI/CD Integration

Tests are automatically run in CI/CD pipelines. See `.github/workflows/test.yml` for configuration details.

## Coverage Reports

Coverage reports are generated in the `coverage/` directory. To view the HTML report:

```bash
open coverage/lcov-report/index.html
```

## Troubleshooting

- **Tests are slow**: Check for unmocked API calls or timers
- **Flaky tests**: Look for race conditions or timing issues
- **Type errors**: Ensure test files have proper TypeScript types
- **Test failures**: Run tests with `--verbose` for more detailed output
