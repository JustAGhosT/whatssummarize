import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/error-handler';
import { logger } from './utils/logger';
import { registerApiRoutes } from './routes/api';

// Initialize Fastify server
const app: FastifyInstance = fastify({
  logger: logger,
  disableRequestLogging: process.env.NODE_ENV === 'test',
});

// Register plugins
app.register(helmet);
app.register(cors, {
  origin: config.cors.origins,
  credentials: true,
});
app.register(rateLimit, {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.windowMs,
});

// Set error handler
app.setErrorHandler(errorHandler);

// Register API routes
registerApiRoutes(app);

// Root health check endpoint (kept for backward compatibility)
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start the server
const start = async () => {
  try {
    await app.listen({
      port: config.port,
      host: config.host,
    });
    logger.info(`Server is running on http://${config.host}:${config.port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await app.close();
  process.exit(0);
});

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

export { app };
