import Joi from 'joi';
import { CHATBOT_LIMITS } from './chatbot.constants.js';

/**
 * Validation schemas for Chatbot module endpoints.
 */
export const chatbotSchemas = {
  sendMessage: Joi.object({
    message: Joi.string()
      .required()
      .trim()
      .min(1)
      .max(CHATBOT_LIMITS.MAX_MESSAGE_LENGTH)
      .messages({
        'string.empty': 'Message cannot be empty',
        'any.required': 'Message is required',
        'string.min': 'Message cannot be empty',
        'string.max': `Message length must be at most ${CHATBOT_LIMITS.MAX_MESSAGE_LENGTH} characters`
      }),
      
    sessionId: Joi.string()
      .optional()
      .trim()
      .alphanum()
      .max(50)
      .default('default')
      .messages({
        'string.alphanum': 'Session ID must be alphanumeric'
      })
  }),

  historyQuery: Joi.object({
    sessionId: Joi.string()
      .optional()
      .trim()
      .default('default'),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};
