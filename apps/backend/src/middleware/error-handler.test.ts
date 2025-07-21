import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { errorHandler } from './error-handler';
import { ApiError } from '../utils/errors';
import { createLogger } from '../utils/logger';

// Mock the logger
vi.mock('../utils/logger', () => ({
  createLogger: vi.fn(() => ({
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    child: vi.fn().mockReturnThis(),
  })),
}));

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockError: FastifyError;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Setup mock request
    mockRequest = {
      id: 'test-request-id',
      method: 'GET',
      url: '/test',
    };

    // Setup mock reply
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    // Setup default error
    mockError = {
      name: 'TestError',
      message: 'Test error message',
      stack: 'Error stack trace',
      statusCode: 500,
    } as FastifyError;
  });

  it('should handle generic errors', () => {
    // Act
    errorHandler(mockError, mockRequest as FastifyRequest, mockReply as FastifyReply);

    // Assert
    expect(mockReply.status).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalledWith({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    });
  });

  it('should handle custom API errors', () => {
    // Arrange
    const apiError = new ApiError('Custom error message', 400, 'VALIDATION_ERROR', {
      field: 'test',
      error: 'Invalid value',
    });

    // Act
    errorHandler(apiError, mockRequest as FastifyRequest, mockReply as FastifyReply);

    // Assert
    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'ApiError',
      message: 'Custom error message',
      details: {
        field: 'test',
        error: 'Invalid value',
      },
    });
  });

  it('should handle validation errors', () => {
    // Arrange
    const validationError: FastifyError = {
      ...mockError,
      validation: [
        {
          keyword: 'required',
          instancePath: '',
          schemaPath: '#/required',
          params: { missingProperty: 'testField' },
          message: "should have required property 'testField'",
        },
      ],
      statusCode: 400,
    };

    // Act
    errorHandler(validationError, mockRequest as FastifyRequest, mockReply as FastifyReply);

    // Assert
    expect(mockReply.status).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation error',
      details: [
        {
          keyword: 'required',
          instancePath: '',
          schemaPath: '#/required',
          params: { missingProperty: 'testField' },
          message: "should have required property 'testField'",
        },
      ],
    });
  });

  it('should include stack trace in development environment', () => {
    // Arrange
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const errorWithDetails: FastifyError = {
      ...mockError,
      details: { some: 'details' },
    };

    // Act
    errorHandler(errorWithDetails, mockRequest as FastifyRequest, mockReply as FastifyReply);

    // Assert
    const response = (mockReply.send as jest.Mock).mock.calls[0][0];
    expect(response).toHaveProperty('stack', 'Error stack trace');
    expect(response).toHaveProperty('details', { some: 'details' });

    // Cleanup
    process.env.NODE_ENV = originalEnv;
  });

  it('should use error status code if provided', () => {
    // Arrange
    const customError: FastifyError = {
      ...mockError,
      statusCode: 403,
      message: 'Forbidden',
    };

    // Act
    errorHandler(customError, mockRequest as FastifyRequest, mockReply as FastifyReply);

    // Assert
    expect(mockReply.status).toHaveBeenCalledWith(403);
    expect(mockReply.send).toHaveBeenCalledWith({
      statusCode: 403,
      error: 'Internal Server Error',
      message: 'Forbidden',
    });
  });
});
