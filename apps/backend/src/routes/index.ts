import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';

export async function registerRoutes(app: FastifyInstance) {
  // Register all routes here
  await app.register(healthRoutes, { prefix: '/api/health' });
  
  // Add a root route
  app.get('/', async () => {
    return { 
      name: 'WhatsApp Summarizer API',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString()
    };
  });

  // Add a 404 handler for undefined routes
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`
    });
  });

  return app;
}
