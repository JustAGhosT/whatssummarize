// @ts-check
const baseConfig = require('../../../jest.config.js');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  // Integration test specific configuration
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.ts',
    '<rootDir>/tests/integration/**/*.test.tsx',
  ],
  // Setup files for integration testing
  setupFilesAfterEnv: [
    ...(baseConfig.setupFilesAfterEnv || []),
    '<rootDir>/tests/setupTests.ts',
    '@testing-library/jest-dom',
  ],
  // Mock static assets and CSS modules
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Test environment for integration tests (Node.js by default)
  testEnvironment: 'node',
  // Transform settings for TypeScript and JSX
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tests/tsconfig.json',
        // Enable React's new JSX transform
        jsx: 'react-jsx',
      },
    ],
  },
  // Coverage settings
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/tests/**',
    '!**/types/**',
  ],
  // Ignore specific files from coverage
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/',
    '/types/',
    '\\.d\\.ts$',
    'index\\.ts',
    'main\.tsx',
  ],
  // Setup for API mocking
  globalSetup: '<rootDir>/tests/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts',
  setupFiles: ['<rootDir>/tests/setup/testSetup.ts'],
  // Test timeout (30 seconds)
  testTimeout: 30000,
};
