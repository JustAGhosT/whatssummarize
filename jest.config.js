// @ts-check
const nextJest = require('next/jest').default;

const createJestConfig = nextJest({
  dir: './frontend',
});

// Custom configuration to be passed to Jest
const customJestConfig = {
  testEnvironment: 'jsdom',
  testTimeout: 10000,
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 
      '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Test match patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.[jt]s?(x)'
  ],
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
      babelConfig: true,
    },
  },
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/out/',
    '/public/',
    '/.vscode/',
    '/coverage/',
    '/dist/',
    '/build/'
  ],
  
  // Coverage settings
  collectCoverage: true,
  collectCoverageFrom: [
    'frontend/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/public/**',
    '!**/scripts/**',
    '!**/tests/**',
    '!**/__mocks__/**',
    '!**/__fixtures__/**',
    '!**/types/**',
    '!**/interfaces/**',
    '!**/constants/**',
    '!**/styles/**',
    '!**/pages/_app.tsx',
    '!**/pages/_document.tsx',
    '!**/pages/api/**',
    '!**/*.config.{js,ts}'
  ],
  
  // Test coverage thresholds
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(cross-fetch|node-fetch|@babel/runtime)/)',
  ],
  
  // Watch plugins (commented out to avoid dependency issues)
  // watchPlugins: [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname',
  // ],
};

module.exports = createJestConfig(customJestConfig);
