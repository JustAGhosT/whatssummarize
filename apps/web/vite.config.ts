import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { config } from 'dotenv';

// Load environment variables
config({ path: '../../.env.test' });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
      },
    }),
    tsconfigPaths({
      root: '../../', // Adjust the root to properly resolve paths in the monorepo
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  define: {
    'import.meta.vitest': 'undefined', // Fix for vitest in production
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/__mocks__/**',
        '**/types/**',
      ],
      all: true,
      clean: true,
      cleanOnRerun: true,
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    // Enable DOM testing
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
      },
    },
  },
});
