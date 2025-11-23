// @ts-check
const baseConfig = require('../../../jest.config.js');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  // Component test specific configuration
  testMatch: [
    '<rootDir>/tests/components/**/*.test.tsx',
    '<rootDir>/tests/components/**/*.test.ts',
  ],
  // Setup files for component testing
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
  // Test environment for components (browser-like)
  testEnvironment: 'jsdom',
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
    '\.d\.ts$',
    'index\.ts',
    'main\.tsx',
  ],
};
