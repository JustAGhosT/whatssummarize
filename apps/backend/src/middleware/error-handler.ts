import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/errors';

export const errorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log the error
  logger.error({
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code,
    statusCode: error.statusCode,
  });

  // Handle custom API errors
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }

  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation error',
      details: error.validation,
    });
  }

  // Handle other errors
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : error.message;

  return reply.status(statusCode).send({
    statusCode,
    error: 'Internal Server Error',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error.details,
    }),
  });
};
