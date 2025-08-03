# Test Mocks

This directory contains global mock implementations for testing.

## Usage

Jest will automatically use files in this directory when mocking Node.js modules. For example, to mock `fs`, create a file named `fs.js` in this directory.

## Guidelines

- Keep mocks simple and focused
- Document any non-obvious mock behavior
- Use `jest.fn()` for function mocks
- Export mock implementations as named exports
- Add TypeScript type definitions for mocks

## Example

```typescript
// __mocks__/fs.js
export const readFileSync = jest.fn(() => 'mock content');
```
