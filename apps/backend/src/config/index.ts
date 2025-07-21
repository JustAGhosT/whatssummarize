import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { readFileSync } from 'fs';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

// Read package.json to get version
const packageJson = JSON.parse(
  readFileSync(path.resolve(process.cwd(), '../../package.json'), 'utf-8')
);

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.string().default('3001'),
  CORS_ORIGINS: z.string().default('*'),
  RATE_LIMIT_MAX: z.string().default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1d'),
  DATABASE_URL: z.string().url(),
  API_PREFIX: z.string().default('/api'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
  NODE_OPTIONS: z.string().optional(),
});

// Parse and validate environment variables
const envVars = envSchema.parse(process.env);

// Export configuration object
export const config = {
  // Environment
  env: envVars.NODE_ENV,
  isDev: envVars.NODE_ENV === 'development',
  isTest: envVars.NODE_ENV === 'test',
  isProd: envVars.NODE_ENV === 'production',
  nodeEnv: envVars.NODE_ENV,
  
  // Application
  appName: 'whatsapp-summarizer-api',
  appVersion: packageJson.version || '0.1.0',
  
  // Server
  host: envVars.HOST,
  port: parseInt(envVars.PORT, 10),
  apiPrefix: envVars.API_PREFIX,
  
  // CORS
  cors: {
    origins: envVars.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
  },
  
  // Rate limiting
  rateLimit: {
    max: parseInt(envVars.RATE_LIMIT_MAX, 10),
    windowMs: parseInt(envVars.RATE_LIMIT_WINDOW_MS, 10),
  },
  
  // JWT
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  
  // Database
  database: {
    url: envVars.DATABASE_URL,
  },
  
  // Logging
  logLevel: envVars.LOG_LEVEL,
  
  // Node options
  nodeOptions: envVars.NODE_OPTIONS,
} as const;

// Export the type of the config object for type checking
export type Config = typeof config;
