import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';
import pinoPretty from 'pino-pretty';
import { config } from '../config';

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface Logger extends PinoLogger {
  child(bindings: Record<string, unknown>, options?: { level?: LogLevel }): Logger;
}

// Define sensitive fields to redact from logs
// Note: 'set-cookie' is a special header and should not be included in redact paths
const REDACT_PATHS = [
  'password',
  '*.password',
  '*.passwordConfirmation',
  '*.token',
  '*.accessToken',
  '*.refreshToken',
  'authorization',
  'Authorization',
  'cookie',
  'cookies',
  'headers.cookie',
  'headers.authorization',
  'headers.Authorization',
  'req.headers.cookie',
  'req.headers.authorization',
  'req.headers.Authorization',
  'apiKey',
  '*.apiKey',
  'api_key',
  '*.api_key',
  'secret',
  '*.secret',
  'privateKey',
  '*.privateKey',
  'private_key',
  '*.private_key',
];

// Create a pretty print stream for development
const prettyPrint = pinoPretty({
  colorize: true,
  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
  ignore: 'pid,hostname',
  messageFormat: (log, messageKey) => {
    const msg = log[messageKey];
    const context = log.context ? `[${log.context}] ` : '';
    return `${context}${msg}`;
  },
  customPrettifiers: {
    time: (timestamp) => `[${timestamp}]`,
  },
});

// Base logger configuration
const pinoOptions: LoggerOptions = {
  level: config.logLevel || (config.isProd ? 'info' : 'debug'),
  redact: {
    paths: REDACT_PATHS,
    remove: true,
    censor: '**REDACTED**',
  },
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    bindings: () => ({}), // Remove default bindings to reduce log size
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  base: {
    env: config.nodeEnv,
    app: config.appName,
    version: config.appVersion,
  },
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  transport: config.isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
};

// Create the root logger instance
const logger = pino(pinoOptions, config.isDev ? prettyPrint : undefined) as Logger;

/**
 * Create a child logger with the given context
 * @param context The context for the logger (usually the module or component name)
 * @param bindings Additional bindings to include in all log messages
 * @returns A child logger instance
 */
export const createLogger = (context: string, bindings: Record<string, unknown> = {}): Logger => {
  return logger.child({ context, ...bindings });
};

// Export the root logger
export { logger };

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught exception');
  // In production, you might want to restart the process here
  if (!config.isDev) {
    process.exit(1);
  }
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ err: reason, promise }, 'Unhandled promise rejection');
  // In production, you might want to restart the process here
  if (!config.isDev) {
    process.exit(1);
  }
});
