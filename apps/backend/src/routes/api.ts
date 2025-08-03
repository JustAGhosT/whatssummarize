import { FastifyInstance } from 'fastify';
import { getHealth } from '../controllers/health.controller';

export const registerApiRoutes = (app: FastifyInstance) => {
  // Health check endpoint
  app.get('/api/health', getHealth);

  // Add more API routes here
  // Example:
  // app.register(userRoutes, { prefix: '/api/users' });
  // app.register(authRoutes, { prefix: '/api/auth' });
};
