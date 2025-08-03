import { FastifyPluginAsync } from 'fastify';
import { healthController } from '../controllers/health.controller';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', healthController.getHealth);
  fastify.get('/liveness', healthController.getLiveness);
  fastify.get('/readiness', healthController.getReadiness);
};
