'use strict';

const AuthService = require('./auth.service');
const ApiResponse = require('../../shared/apiResponse');
const ApiError = require('../../shared/apiError');
const { logger } = require('../../shared/logger');

class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      return ApiResponse.success(res, 'Account created successfully. Welcome to RailSwap!', result, 201);
    } catch (error) {
      logger.error('Register error', { message: error.message });
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      return ApiResponse.success(res, 'Login successful. Welcome back!', result, 200);
    } catch (error) {
      logger.error('Login error', { message: error.message });
      next(error);
    }
  }

  /**
   * GET /api/auth/me  (Protected — requires valid JWT or dev mock user)
   * Returns the authenticated user's profile.
   */
  async getMe(req, res, next) {
    try {
      // In dev mode, req.user may be the mock user (no real DB record)
      if (process.env.NODE_ENV === 'development' && req.user?.id === 'dev-user-id-000000000000') {
        return ApiResponse.success(res, 'User profile fetched.', req.user, 200);
      }

      const User = require('./auth.model');
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(ApiError.notFound('User not found.'));
      }
      return ApiResponse.success(res, 'User profile fetched.', user.toJSON(), 200);
    } catch (error) {
      logger.error('GetMe error', { message: error.message });
      next(error);
    }
  }
}

module.exports = new AuthController();
