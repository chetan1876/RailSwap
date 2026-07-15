'use strict';

class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {*} details
   */
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', details = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized. Please log in.') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Access denied.') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found.') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Resource already exists.') {
    return new ApiError(409, message);
  }

  static tooManyRequests(message = 'Too many requests. Please wait and try again.') {
    return new ApiError(429, message);
  }

  static internal(message = 'Internal server error.', details = null) {
    return new ApiError(500, message, details);
  }
}

module.exports = ApiError;
