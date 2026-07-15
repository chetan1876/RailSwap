'use strict';

const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const ApiError = require('../../shared/apiError');
const { logger } = require('../../shared/logger');

class AuthService {
  /**
   * Register a new user and return JWT tokens.
   * @param {{name:string, email:string, password:string, phone?:string}} data
   */
  async register(data) {
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
  }

  /**
   * Authenticate user credentials and return JWT tokens.
   * @param {{email:string, password:string}} data
   */
  async login(data) {
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
  }

  /**
   * Generate access and refresh JWT tokens.
   * @param {import('./auth.model')} user
   */
  _generateTokens(user) {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '15m',
    });

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d' }
    );

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
