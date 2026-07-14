'use strict';

const jwt = require('jsonwebtoken');
const ApiError = require('../shared/apiError');
const { logger } = require('../shared/logger');

/**
 * JWT Authentication Middleware.
 *
 * Production: Verifies Bearer token in the Authorization header.
 * Development (NODE_ENV=development): If no token is provided OR the token is
 * the dev placeholder, a mock user is attached so the app works without a
 * real login session (e.g. when testing chatbot endpoints directly).
 * A real, valid JWT still works in development — this only fires when absent.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const isDev = process.env.NODE_ENV === 'development';

    // ── Development fallback ─────────────────────────────────────────────────
    // Allow requests through with a mock user when:
    //   • No Authorization header is present, OR
    //   • The header contains the known dev placeholder token.
    if (isDev) {
      const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (!token || token === 'dev-mock-access-token') {
        req.user = {
          id: 'dev-user-id-000000000000',
          email: 'dev@railswap.local',
          name: 'Dev User',
          role: 'user',
        };
        logger.debug('[DEV] Auth middleware: using mock user (no valid token provided)');
        return next();
      }
    }
    // ── Production (and dev with a real token) ───────────────────────────────

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Access denied. No token provided.'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(ApiError.unauthorized('Access denied. Invalid token format.'));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error('JWT_SECRET is not set in environment variables.');
      return next(ApiError.internal('Server authentication configuration error.'));
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (error) {
    logger.warn('JWT verification failed', { error: error.message });

    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Session expired. Please log in again.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token. Please log in again.'));
    }

    return next(ApiError.unauthorized('Authentication failed.'));
  }
};

module.exports = authMiddleware;
