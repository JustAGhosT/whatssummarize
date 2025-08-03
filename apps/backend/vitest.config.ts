import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { config } from 'dotenv';

// Load environment variables
config({ path: '../../.env.test' });

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      '!**/node_modules/**',
      '!**/dist/**',
      '!**/coverage/**',
    ],
    setupFiles: ['src/test/setup.ts'],
    reporters: ['default', 'html'],
    outputTruncateLength: 1000,
    outputDiffLines: 100,
    logLevel: 'info',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '**/__tests__/**',
        '**/*.d.ts',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/test/**',
        '**/types/**',
        '**/index.ts',
        '**/main.ts',
        '**/app.ts',
        '**/config/**',
        '**/migrations/**',
        '**/prisma/**',
        '**/routes/**',
      ],
      all: true,
      clean: true,
      cleanOnRerun: true,
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
      watermarks: {
        statements: [50, 80],
        functions: [50, 80],
        branches: [50, 80],
        lines: [50, 80],
      },
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
