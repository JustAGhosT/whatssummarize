import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { FastifyInstance, fastify } from 'fastify';
import { healthController } from './controllers/health.controller';
import { config } from './config';
import { createLogger } from './utils/logger';

// Mock the logger module
vi.mock('./utils/logger', () => ({
  createLogger: vi.fn().mockImplementation(() => ({
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    child: vi.fn().mockImplementation(() => ({
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    })),
  })),
}));

// Simple test to verify testing setup
it('should run a simple test', () => {
  expect(true).toBe(true);
});

describe('Health Controller', () => {
  let app: FastifyInstance;
  let testApp: FastifyInstance;

  beforeAll(() => {
    // Clear all mocks before any test runs
    vi.clearAllMocks();
  });

  beforeEach(async () => {
    console.log('Setting up test environment...');
    
    // Create a new Fastify instance for each test
    testApp = fastify({
      logger: false,
    });

    console.log('Registering routes...');
    
    // Register routes
    testApp.get('/health', healthController.getHealth);
    testApp.get('/liveness', healthController.getLiveness);
    testApp.get('/readiness', healthController.getReadiness);

    // Add error handler
    testApp.setErrorHandler((error, request, reply) => {
      console.error('Test error handler triggered:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        name: error.name
      });
      
      reply.status(500).send({ 
        error: 'Test Server Error', 
        message: error.message,
        stack: process.env.NODE_ENV === 'test' ? error.stack : undefined
      });
    });

    // Log when routes are registered
    testApp.addHook('onReady', () => {
      console.log('Fastify app is ready');
    });

    // Initialize the app
    try {
      console.log('Initializing Fastify app...');
      await testApp.ready();
      console.log('Fastify app initialized successfully');
      app = testApp;
    } catch (error) {
      console.error('Error initializing Fastify app:', error);
      throw error;
    }
  });

  afterEach(async () => {
    // Close the server after each test
    await testApp?.close();
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      console.log('Starting health check test...');
      
      try {
        console.log('Sending request to /health endpoint...');
        const response = await app.inject({
          method: 'GET',
          url: '/health',
        });

        console.log('Received response with status code:', response.statusCode);
        
        try {
          const data = response.json();
          console.log('Response data:', JSON.stringify(data, null, 2));
          
          expect(response.statusCode).toBe(200);
          expect(data).toHaveProperty('status', 'ok');
          expect(data).toHaveProperty('service', 'whatsapp-summarizer-api');
          expect(data).toHaveProperty('version', config.appVersion);
          expect(data).toHaveProperty('environment', config.nodeEnv);
          expect(data).toHaveProperty('nodeVersion');
          expect(data).toHaveProperty('uptime');
          expect(data).toHaveProperty('memoryUsage');
          
          console.log('All assertions passed!');
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          console.error('Raw response payload:', response.payload);
          throw parseError;
        }
      } catch (error) {
        console.error('Test error:', {
          message: error.message,
          stack: error.stack,
          code: error.code,
          name: error.name
        });
        throw error;
      }
    });
  });

  describe('GET /liveness', () => {
    it('should return liveness status', async () => {
      try {
        const response = await app.inject({
          method: 'GET',
          url: '/liveness',
        });

        console.log('Liveness response:', response.json());
        
        expect(response.statusCode).toBe(200);
        const data = response.json();
        expect(data).toHaveProperty('status', 'alive');
        expect(data).toHaveProperty('timestamp');
      } catch (error) {
        console.error('Liveness test error:', error);
        throw error;
      }
    });
  });

  describe('GET /readiness', () => {
    it('should return readiness status', async () => {
      try {
        const response = await app.inject({
          method: 'GET',
          url: '/readiness',
        });

        console.log('Readiness response:', response.json());
        
        expect(response.statusCode).toBe(200);
        const data = response.json();
        expect(data).toHaveProperty('status', 'ready');
        expect(data).toHaveProperty('timestamp');
        expect(data).toHaveProperty('checks');
        expect(data.checks).toHaveProperty('database', true);
      } catch (error) {
        console.error('Readiness test error:', error);
        throw error;
      }
    });
  });
});
