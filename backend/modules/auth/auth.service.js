'use strict';

const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const ApiError = require('../../shared/apiError');
const { logger } = require('../../shared/logger');

// ── Dev-mode mock constants ──────────────────────────────────────────────────
// Used ONLY in NODE_ENV=development when MongoDB is unreachable.
const DEV_MOCK_USER = {
  _id: 'dev-user-id-000000000000',
  id: 'dev-user-id-000000000000',
  name: 'Dev User',
  email: 'dev@railswap.local',
  phone: '9999999999',
  role: 'user',
  createdAt: new Date().toISOString(),
};

const DEV_MOCK_TOKENS = {
  accessToken: 'dev-mock-access-token',
  refreshToken: 'dev-mock-refresh-token',
};

class AuthService {
  /**
   * Register a new user and return JWT tokens.
   * Falls back to a mock response in development when the DB is unreachable.
   * @param {{name:string, email:string, password:string, phone?:string}} data
   */
  async register(data) {
    try {
      const { name, email, password, phone } = data;

      // Check if email already exists
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        throw ApiError.conflict('An account with this email already exists.');
      }

      const user = new User({ name, email, password, phone });
      await user.save();

      logger.info('New user registered', { userId: user._id, email: user.email });

      const tokens = this._generateTokens(user);
      return { user: user.toJSON(), ...tokens };
    } catch (err) {
      // Re-throw known operational errors (conflict, validation, etc.)
      if (err.isOperational) throw err;

      // In development, fall back to mock if DB is unreachable
      if (process.env.NODE_ENV === 'development') {
        logger.warn('[DEV] DB unreachable during register — returning mock user', { error: err.message });
        const mockUser = { ...DEV_MOCK_USER, name: data.name || DEV_MOCK_USER.name, email: data.email || DEV_MOCK_USER.email };
        return { user: mockUser, ...DEV_MOCK_TOKENS };
      }

      throw err;
    }
  }

  /**
   * Authenticate user credentials and return JWT tokens.
   * Falls back to a mock login in development when the DB is unreachable.
   * @param {{email:string, password:string}} data
   */
  async login(data) {
    try {
      const { email, password } = data;

      // Explicitly select password (select: false in schema)
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        throw ApiError.unauthorized('Invalid email or password.');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw ApiError.unauthorized('Invalid email or password.');
      }

      logger.info('User logged in', { userId: user._id });

      const tokens = this._generateTokens(user);
      return { user: user.toJSON(), ...tokens };
    } catch (err) {
      // Re-throw known operational errors (wrong credentials, etc.)
      if (err.isOperational) throw err;

      // In development, accept any credentials when DB is unreachable
      if (process.env.NODE_ENV === 'development') {
        logger.warn('[DEV] DB unreachable during login — returning mock user', { error: err.message });
        return { user: DEV_MOCK_USER, ...DEV_MOCK_TOKENS };
      }

      throw err;
    }
  }

  /**
   * Generate access and refresh JWT tokens for a user.
   * @param {import('./auth.model')} user
   */
  _generateTokens(user) {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw ApiError.internal('JWT_SECRET is not configured.');
    }

    const accessToken = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRE || '15m',
    });

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      process.env.REFRESH_TOKEN_SECRET || secret,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
    );

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
