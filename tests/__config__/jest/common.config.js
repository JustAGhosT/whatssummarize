// @ts-check

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Common setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/__scripts__/setup/setupTests.ts',
    '@testing-library/jest-dom',
  ],
  
  // Common module name mapper
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
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
