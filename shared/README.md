# Shared

This directory contains code and types that are shared between the frontend and backend of the application.

## Structure

- `types/` - Shared TypeScript type definitions used across the application

## Usage

Import shared types in your code like this:

```typescript
import { SomeType } from '../../../shared/types/some-type';
```

## Adding New Shared Code

1. Add new TypeScript type definitions in the `types/` directory
2. Keep the API surface minimal - only share what's truly needed by both frontend and backend
3. Avoid business logic in shared code - prefer pure types and interfaces

## Versioning

When making changes to shared types, ensure backwards compatibility or coordinate updates between frontend and backend services.
