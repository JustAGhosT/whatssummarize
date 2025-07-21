export class ApiError extends Error {
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    
    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Common error types as static methods for convenience
  static badRequest(message: string, details?: Record<string, unknown>) {
    return new ApiError(message, 400, details);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(message, 401);
  }

  static forbidden(message: string = 'Forbidden') {
    return new ApiError(message, 403);
  }

  static notFound(message: string = 'Resource not found') {
    return new ApiError(message, 404);
  }

  static conflict(message: string, details?: Record<string, unknown>) {
    return new ApiError(message, 409, details);
  }

  static validationError(message: string, details?: Record<string, unknown>) {
    return new ApiError(message, 422, details);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(message, 500);
  }
}
