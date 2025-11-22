// @ts-check
const baseConfig = require('../../../jest.config.js');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  // Add test-specific overrides here
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/unit/**/*.test.tsx',
  ],
  // Add any test-specific setup
  setupFilesAfterEnv: [
    ...(baseConfig.setupFilesAfterEnv || []),
    '<rootDir>/tests/setupTests.ts',
  ],
  // Ensure test files are properly transformed
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tests/tsconfig.json',
      },
    ],
  },
};
