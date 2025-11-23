// @ts-check
const baseConfig = require('../../../jest.config.js');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  // Common setup files
  setupFilesAfterEnv: [
    ...(baseConfig.setupFilesAfterEnv || []),
    '<rootDir>/tests/setupTests.ts',
    '@testing-library/jest-dom',
  ],
  // Common module name mapper
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Common transform settings
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tests/tsconfig.json',
        jsx: 'react-jsx',
      },
    ],
  },
  // Common coverage settings
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/tests/**',
    '!**/types/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/',
    '/types/',
    '\\.d\\.ts$',
    'index\\.ts',
    'main\\.tsx',
  ],
};
