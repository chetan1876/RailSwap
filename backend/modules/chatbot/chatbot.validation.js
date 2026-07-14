'use strict';

const Joi = require('joi');
const { CHATBOT_LIMITS } = require('./chatbot.constants');

/**
 * Validation schemas for all Chatbot module endpoints.
 */
const chatbotSchemas = {
  sendMessage: Joi.object({
    message: Joi.string()
      .required()
      .trim()
      .min(CHATBOT_LIMITS.MIN_MESSAGE_LENGTH)
      .max(CHATBOT_LIMITS.MAX_MESSAGE_LENGTH)
      .messages({
        'string.empty': 'Message cannot be empty',
        'any.required': 'Message is required',
        'string.min': 'Message cannot be empty',
        'string.max': `Message must be at most ${CHATBOT_LIMITS.MAX_MESSAGE_LENGTH} characters`,
      }),

    sessionId: Joi.string()
      .optional()
      .trim()
      .max(60)
      .default('default')
      .messages({ 'string.max': 'Session ID is too long' }),

    sessionName: Joi.string()
      .optional()
      .trim()
      .max(CHATBOT_LIMITS.MAX_SESSION_NAME_LENGTH)
      .allow('', null),
  }),

  historyQuery: Joi.object({
    sessionId: Joi.string().optional().trim().default('default'),
    limit: Joi.number().integer().min(1).max(CHATBOT_LIMITS.MAX_HISTORY_LIMIT)
      .default(CHATBOT_LIMITS.DEFAULT_HISTORY_LIMIT),
    page: Joi.number().integer().min(1).default(1),
  }),

  renameSession: Joi.object({
    sessionName: Joi.string()
      .required()
      .trim()
      .min(1)
      .max(CHATBOT_LIMITS.MAX_SESSION_NAME_LENGTH)
      .messages({
        'any.required': 'Session name is required',
        'string.empty': 'Session name cannot be empty',
        'string.max': `Session name must be at most ${CHATBOT_LIMITS.MAX_SESSION_NAME_LENGTH} characters`,
      }),
  }),

  messageId: Joi.object({
    id: Joi.string()
      .required()
      .length(24)
      .hex()
      .messages({
        'any.required': 'Message ID is required',
        'string.length': 'Invalid message ID format',
        'string.hex': 'Invalid message ID format',
      }),
  }),
};

module.exports = { chatbotSchemas };
