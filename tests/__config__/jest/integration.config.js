// @ts-check
const commonConfig = require('./common.config.js');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...commonConfig,
  // Integration test specific configuration
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.ts',
    '<rootDir>/tests/integration/**/*.test.tsx',
  ],
  // Test environment for integration tests (Node.js by default)
  testEnvironment: 'node',
  // Setup for API mocking
  globalSetup: '<rootDir>/tests/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts',
  setupFiles: ['<rootDir>/tests/setup/testSetup.ts'],
  // Test timeout (30 seconds)
  testTimeout: 30000,
};
