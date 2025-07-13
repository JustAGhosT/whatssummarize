// @ts-check
const nextJest = require('next/jest').default;

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
});

// Custom configuration to be passed to Jest
const customJestConfig = {
  roots: ['<rootDir>/tests'],
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '<rootDir>/tests/setupTests.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Module name mapping - must match your tsconfig.json paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/styles/(.*)$': '<rootDir>/styles/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '^@/public/(.*)$': '<rootDir>/public/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/constants/(.*)$': '<rootDir>/constants/$1',
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/mocks/(.*)$': '<rootDir>/__mocks__/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Test path patterns to ignore
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/',
  ],
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Module transformation ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(cross-fetch|node-fetch)/)',
  ],
  
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
  ],
  
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
