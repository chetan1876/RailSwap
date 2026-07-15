'use strict';

const AuthService = require('./auth.service');
const ApiResponse = require('../../shared/apiResponse');
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
      logger.error('Register error', error);
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
      logger.error('Login error', error);
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Returns the authenticated user's profile.
   */
  async getMe(req, res, next) {
    try {
      const User = require('./auth.model');
      const user = await User.findById(req.user.id);
      if (!user) {
        const ApiError = require('../../shared/apiError');
        return next(ApiError.notFound('User not found.'));
      }
      return ApiResponse.success(res, 'User profile fetched.', user.toJSON(), 200);
    } catch (error) {
      logger.error('GetMe error', error);
      next(error);
    }
  }
}

module.exports = new AuthController();
