import 'reflect-metadata';
import fastify from 'fastify';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error-handler';
import { registerRoutes } from './routes';

// Create Fastify server instance
const app = fastify({
  logger,
  disableRequestLogging: process.env.NODE_ENV === 'production',
  trustProxy: true,
});

// Register plugins and routes
async function main() {
  try {
    // Register error handler
    app.setErrorHandler(errorHandler);

    // Register routes
    await registerRoutes(app);

    // Start the server
    const address = await app.listen({
      port: config.port,
      host: config.host,
    });

    logger.info(`Server listening at ${address}`);

    // Handle graceful shutdown
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        await app.close();
        process.exit(0);
      });
    });
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

// Start the application
if (require.main === module) {
  main();
}

export { app };
