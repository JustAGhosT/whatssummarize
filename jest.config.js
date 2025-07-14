// @ts-check
const nextJest = require('next/jest').default;

const createJestConfig = nextJest({
  dir: './',
});

// Custom configuration to be passed to Jest
const customJestConfig = {
  // Test directories
  roots: ['<rootDir>/tests'],
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/tests/setupTests.ts',
    '@testing-library/jest-dom'
  ],
  
  // Module resolution
  moduleDirectories: ['node_modules', '<rootDir>'],
  modulePaths: ['<rootDir>'],
  
  // Module name mapping - must match your tsconfig.json paths
  moduleNameMapper: {
    // Core paths
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/frontend/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/frontend/utils/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/styles/(.*)$': '<rootDir>/frontend/styles/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '^@/public/(.*)$': '<rootDir>/public/$1',
    '^@/hooks/(.*)$': '<rootDir>/frontend/hooks/$1',
    '^@/contexts/(.*)$': '<rootDir>/frontend/contexts/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/constants/(.*)$': '<rootDir>/constants/$1',
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/mocks/(.*)$': '<rootDir>/__mocks__/$1',
    
    // Frontend specific
    '^@/frontend/(.*)$': '<rootDir>/frontend/$1',
    
    // Backend specific
    '^@/backend/(.*)$': '<rootDir>/backend/$1',
    
    // Handle CSS modules and other assets
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 
      '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Test path patterns to ignore
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/',
    '<rootDir>/dist/',
    '<rootDir>/.github/',
    '<rootDir>/coverage/',
    '<rootDir>/.husky/',
  ],
  
  // Collect coverage
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/types/**',
    '!**/tests/**',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/main.tsx',
    '!**/_app.tsx',
    '!**/_document.tsx',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Module transformation ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(cross-fetch|node-fetch|@babel/runtime)/)',
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.[jt]s?(x)',
    '**/tests/**/*.spec.[jt]s?(x)',
    '**/__tests__/**/*.[jt]s?(x)',
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ].filter(Boolean),
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/cypress/**',
    '!jest.config.js',
    '!next.config.js',
    '!postcss.config.js',
    '!tailwind.config.js',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};

// Create and export the final config
module.exports = createJestConfig(customJestConfig);
