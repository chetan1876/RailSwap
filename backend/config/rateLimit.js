'use strict';

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter: 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  skip: (req) => req.path === '/health',
});

/**
 * Chat-specific rate limiter: 20 messages per minute per IP.
 * Prevents AI API abuse.
 */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many chat messages. Please slow down and try again in a minute.',
  },
});

module.exports = { generalLimiter, chatLimiter };
