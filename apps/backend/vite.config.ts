import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        server: resolve(__dirname, 'src/server.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/*.test.ts', 'src/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/__tests__/',
        '**/*.d.ts',
        '**/*.test.{js,ts}'
      ],
      all: true,
      src: ['src'],
    },
    testTimeout: 10000,
  },
});
