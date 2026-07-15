'use strict';

const { Router } = require('express');
const ChatbotController = require('./chatbot.controller');
const { chatbotSchemas } = require('./chatbot.validation');
const validate = require('../../middleware/validator');
const authMiddleware = require('../../middleware/auth');
const { chatLimiter } = require('../../config/rateLimit');

const router = Router();

// Secure all chatbot endpoints with JWT authentication
router.use(authMiddleware);

/**
 * POST /api/chat/message
 * Submit user query to AI Railway Assistant
 */
router.post(
  '/message',
  chatLimiter,
  validate(chatbotSchemas.sendMessage, 'body'),
  (req, res, next) => ChatbotController.sendMessage(req, res, next)
);

/**
 * GET /api/chat/sessions
 * Get all chat sessions for the authenticated user
 */
router.get(
  '/sessions',
  (req, res, next) => ChatbotController.getSessions(req, res, next)
);

/**
 * GET /api/chat/history
 * Retrieve paginated conversation history
 */
router.get(
  '/history',
  validate(chatbotSchemas.historyQuery, 'query'),
  (req, res, next) => ChatbotController.getHistory(req, res, next)
);

/**
 * DELETE /api/chat/history
 * Clear all messages in a session
 */
router.delete(
  '/history',
  validate(chatbotSchemas.historyQuery, 'query'),
  (req, res, next) => ChatbotController.clearHistory(req, res, next)
);

/**
 * PUT /api/chat/session/:id
 * Rename a chat session (id = sessionId string)
 */
router.put(
  '/session/:id',
  validate(chatbotSchemas.renameSession, 'body'),
  (req, res, next) => ChatbotController.renameSession(req, res, next)
);

/**
 * DELETE /api/chat/:id
 * Soft-delete a single message by MongoDB ObjectId
 */
router.delete(
  '/:id',
  validate(chatbotSchemas.messageId, 'params'),
  (req, res, next) => ChatbotController.deleteMessage(req, res, next)
);

module.exports = router;
