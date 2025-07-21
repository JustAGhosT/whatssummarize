import { FastifyRequest, FastifyReply } from 'fastify';
import { createLogger } from '../utils/logger';
import { config } from '../config';

const logger = createLogger('HealthController');

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  nodeVersion: string;
  environment: string;
  service: string;
  version: string;
  [key: string]: unknown;
}

export const healthController = {
  /**
   * Comprehensive health check endpoint
   */
  getHealth: async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      logger.debug('Comprehensive health check requested');
      
      // Debug log config values
      logger.debug('Config values:', {
        nodeEnv: config.nodeEnv,
        appVersion: config.appVersion
      });
      
      const response: HealthResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        environment: config.nodeEnv,
        service: 'whatsapp-summarizer-api',
        version: config.appVersion,
      };

      logger.debug('Sending health response');
      return reply.send(response);
    } catch (error) {
      logger.error('Error in health check:', error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  },

  /**
   * Liveness check for Kubernetes
   * Indicates whether the container is running
   */
  getLiveness: async (_request: FastifyRequest, reply: FastifyReply) => {
    logger.debug('Liveness check requested');
    
    return reply.send({
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Readiness check for Kubernetes
   * Indicates whether the container is ready to serve requests
   */
  getReadiness: async (request: FastifyRequest, reply: FastifyReply) => {
    logger.debug('Readiness check requested');
    
    const checks: Record<string, boolean> = {
      // Add your readiness checks here
      database: true, // Example: await checkDatabaseConnection()
      // externalService: await checkExternalService(),
    };

    const isReady = Object.values(checks).every(Boolean);
    const status = isReady ? 'ready' : 'not ready';
    
    return reply.status(isReady ? 200 : 503).send({
      status,
      timestamp: new Date().toISOString(),
      checks,
    });
  },
};
