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
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', validate(registerSchema, 'body'), AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 */
router.post('/login', validate(loginSchema, 'body'), AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 */
router.get('/me', authMiddleware, AuthController.getMe);

module.exports = router;
