import { Router } from 'express';
import ChatbotController from './chatbot.controller.js';
import { chatbotSchemas } from './chatbot.validation.js';
import validate from '../../middleware/validator.js';
import authMiddleware from '../../middleware/auth.js';

const router = Router();

// Secure all chatbot endpoints using JWT authentication
router.use(authMiddleware);

/**
 * Route: POST /api/chat/message
 * Description: Submit query to AI chatbot and retrieve assistant reply
 */
router.post(
  '/message',
  validate(chatbotSchemas.sendMessage, 'body'),
  ChatbotController.sendMessage
);

/**
 * Route: GET /api/chat/history
 * Description: Retrieve past conversation turns for the authenticated user
 */
router.get(
  '/history',
  validate(chatbotSchemas.historyQuery, 'query'),
  ChatbotController.getHistory
);

/**
 * Route: DELETE /api/chat/history
 * Description: Clear conversation logs for the authenticated user
 */
router.delete(
  '/history',
  validate(chatbotSchemas.historyQuery, 'query'),
  ChatbotController.clearHistory
);

export default router;
