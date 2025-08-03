// @ts-check
const nextJest = require('next/jest').default;

const createJestConfig = nextJest({
  // Path to your Next.js app
  dir: './',
});

// Custom configuration to be passed to Jest
const customJestConfig = {
  // The root of your source code
  rootDir: '../../',
  roots: ['<rootDir>/apps/web/src', '<rootDir>/tools/test-utils'],
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/apps/web/jest.setup.js'],
  
  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>/apps/web/node_modules'],
  
  // Module name mapping - must match your tsconfig.json paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^@ui/(.*)$': '<rootDir>/packages/ui/src/$1',
    '^@utils/(.*)$': '<rootDir>/packages/utils/src/$1',
    '^@config/(.*)$': '<rootDir>/packages/config/src/$1',
    '^@/types/(.*)$': '<rootDir>/apps/web/src/types/$1',
    '^@/tests/(.*)$': '<rootDir>/tools/test-utils/$1',
    '^@/styles/(.*)$': '<rootDir>/apps/web/src/styles/$1',
    '^@/public/(.*)$': '<rootDir>/apps/web/public/$1',
    '^@/hooks/(.*)$': '<rootDir>/apps/web/src/hooks/$1',
    '^@/contexts/(.*)$': '<rootDir>/packages/contexts/src/$1',
    '^@/services/(.*)$': '<rootDir>/apps/web/src/services/$1',
    '^@/constants/(.*)$': '<rootDir>/apps/web/src/constants/$1',
    '^@/assets/(.*)$': '<rootDir>/apps/web/src/assets/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  
  // Test path patterns to ignore
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/cypress/'
  ],
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Module transformation ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(date-fns|@babel/runtime|@babel/preset-env|@babel/plugin-transform-runtime)/)',
  ],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

// Create and export the final config
module.exports = createJestConfig(customJestConfig);
