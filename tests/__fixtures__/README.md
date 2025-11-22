# Test Fixtures

This directory contains static test data and fixtures used across tests.

## Structure

- `data/` - JSON files with test data
- `files/` - Test files (images, documents, etc.)
- `responses/` - API response fixtures

## Usage

Import fixtures in your test files:

```typescript
import testData from '@/tests/__fixtures__/data/test-data.json';
```

## Guidelines

- Keep fixture data minimal and focused
- Use descriptive file and variable names
- Document the purpose of complex fixtures
- Keep sensitive data in `.env.test` or mock it
- Use TypeScript types for fixtures
