import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { fastify, FastifyInstance } from 'fastify';

describe('Fastify Test', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    console.log('Setting up Fastify test server...');
    
    // Create a new Fastify instance
    app = fastify({
      logger: false,
    });

    // Add a simple route
    app.get('/test', async (request, reply) => {
      console.log('Test route called');
      return { status: 'ok', message: 'Test route works!' };
    });

    // Start the server
    await app.ready();
    console.log('Fastify test server ready');
  });

  afterAll(async () => {
    console.log('Closing Fastify test server...');
    await app.close();
  });

  it('should handle a basic request', async () => {
    console.log('Sending test request...');
    
    const response = await app.inject({
      method: 'GET',
      url: '/test',
    });

    console.log('Test response:', {
      statusCode: response.statusCode,
      body: response.body,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      status: 'ok',
      message: 'Test route works!',
    });
    
    console.log('Test completed successfully');
  });
});
