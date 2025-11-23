// @ts-check
const commonConfig = require('./common.config.js');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...commonConfig,
  // Component test specific configuration
  testMatch: [
    '<rootDir>/tests/components/**/*.test.tsx',
    '<rootDir>/tests/components/**/*.test.ts',
  ],
};
