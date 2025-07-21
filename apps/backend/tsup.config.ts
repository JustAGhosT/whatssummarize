import { defineConfig } from 'tsup';
import { join } from 'path';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: !options.watch,
  target: 'es2022',
  outDir: 'dist',
  // Bundle external dependencies
  noExternal: [],
  // Don't bundle these dependencies
  external: [
    'fastify',
    'pino',
    'pino-pretty',
    'zod',
    'dotenv',
    'bcryptjs',
    'jsonwebtoken',
    'cors',
    'helmet',
    '@fastify/rate-limit',
    '@prisma/client',
  ],
  // Copy package.json and other assets
  onSuccess: 'cp package.json dist/ && cp -r prisma dist/',
  // Environment variables
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production',
  },
  // Bundle entry point
  entryPoints: ['src/index.ts'],
  // Output format
  format: ['cjs', 'esm'],
  // Minify the output
  minify: !options.watch,
  // Generate source maps
  sourcemap: true,
  // Target environment
  target: 'es2022',
  // Output directory
  outDir: 'dist',
  // Clean the output directory before building
  clean: true,
  // Generate declaration files
  dts: true,
  // Don't bundle these dependencies
  noExternal: [],
}));
