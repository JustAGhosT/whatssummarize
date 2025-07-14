# Test Scripts

This directory contains utility scripts and helpers for testing.

## Structure

- `setup/` - Test setup and teardown scripts
- `utils/` - Shared test utilities and helpers
- `generators/` - Test data generators and factories

## Usage

Import utilities in your test files as needed:

```typescript
import { testHelper } from '@/tests/__scripts__/utils/test-helper';
```

## Guidelines

- Keep utility functions pure and focused on a single responsibility
- Document complex utilities with JSDoc comments
- Add TypeScript types for all exports
- Group related utilities in separate files
