'use strict';

const { Router } = require('express');
const AuthController = require('./auth.controller');
const validate = require('../../middleware/validator');
const authMiddleware = require('../../middleware/auth');
const Joi = require('joi');

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({ 'any.required': 'Name is required', 'string.min': 'Name must be at least 2 characters' }),
  email: Joi.string().email().lowercase().trim().required()
    .messages({ 'any.required': 'Email is required', 'string.email': 'Invalid email address' }),
  password: Joi.string().min(6).max(100).required()
    .messages({ 'any.required': 'Password is required', 'string.min': 'Password must be at least 6 characters' }),
  phone: Joi.string().trim().optional().allow(''),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required()
    .messages({ 'any.required': 'Email is required' }),
  password: Joi.string().required()
    .messages({ 'any.required': 'Password is required' }),
});

/**
 * POST /api/auth/register
 */
router.post('/register', validate(registerSchema, 'body'), AuthController.register);

/**
 * POST /api/auth/login
 */
router.post('/login', validate(loginSchema, 'body'), AuthController.login);

/**
 * GET /api/auth/me  (Protected)
 */
router.get('/me', authMiddleware, AuthController.getMe);

module.exports = router;
