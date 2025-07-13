// @ts-check
const nextJest = require('next/jest').default;

const createJestConfig = nextJest({
  // Path to your Next.js app
  dir: './',
});

// Custom configuration to be passed to Jest
const customJestConfig = {
  // The root of your source code
  rootDir: '../../whatssummarize',
  roots: ['<rootDir>/frontend/src', '<rootDir>/tests'],
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/frontend/jest.setup.js'],
  
  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>/frontend/node_modules'],
  
  // Module name mapping - must match your tsconfig.json paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/src/$1',
    '^@/components/(.*)$': '<rootDir>/frontend/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/frontend/src/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/frontend/src/utils/$1',
    '^@/types/(.*)$': '<rootDir>/frontend/src/types/$1',
    '^@/styles/(.*)$': '<rootDir>/frontend/src/styles/$1',
    '^@/public/(.*)$': '<rootDir>/frontend/public/$1',
    '^@/hooks/(.*)$': '<rootDir>/frontend/src/hooks/$1',
    '^@/contexts/(.*)$': '<rootDir>/frontend/src/contexts/$1',
    '^@/services/(.*)$': '<rootDir>/frontend/src/services/$1',
    '^@/constants/(.*)$': '<rootDir>/frontend/src/constants/$1',
    '^@/assets/(.*)$': '<rootDir>/frontend/src/assets/$1',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
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
