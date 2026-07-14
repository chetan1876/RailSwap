'use strict';

const ChatbotService = require('./chatbot.service');
const { ChatMessageInputDTO, RenameSessionDTO } = require('./chatbot.dto');
const ApiResponse = require('../../shared/apiResponse');
const { logger } = require('../../shared/logger');

/**
 * Controller class for all Chatbot Module routes.
 */
class ChatbotController {
  /**
   * POST /api/chat/message
   * Submit a user query to Gemini and return the AI reply.
   */
  async sendMessage(req, res, next) {
    try {
      const inputDto = new ChatMessageInputDTO(req.body);
      const userId = req.user.id;

      const responseDto = await ChatbotService.processUserMessage(inputDto, userId);

      return ApiResponse.success(res, 'Assistant reply generated successfully', responseDto, 200);
    } catch (error) {
      logger.error('Controller error in sendMessage', error);
      next(error);
    }
  }

  /**
   * GET /api/chat/history
   * Retrieve paginated conversation history.
   */
  async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { sessionId, limit, page } = req.query;

      const result = await ChatbotService.getUserChatHistory(
        userId,
        sessionId || 'default',
        parseInt(limit, 10) || 20,
        parseInt(page, 10) || 1
      );

      return ApiResponse.success(res, 'Chat history fetched successfully', result, 200);
    } catch (error) {
      logger.error('Controller error in getHistory', error);
      next(error);
    }
  }

  /**
   * DELETE /api/chat/history
   * Delete all messages in a session for the logged-in user.
   */
  async clearHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const sessionId = req.query.sessionId || 'default';

      const result = await ChatbotService.clearUserChatHistory(userId, sessionId);

      return ApiResponse.success(
        res,
        `Chat history cleared. ${result.deletedCount} message(s) deleted.`,
        { deletedCount: result.deletedCount },
        200
      );
    } catch (error) {
      logger.error('Controller error in clearHistory', error);
      next(error);
    }
  }

  /**
   * DELETE /api/chat/:id
   * Soft-delete a single chat message.
   */
  async deleteMessage(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await ChatbotService.deleteMessage(id, userId);

      return ApiResponse.success(res, 'Message deleted successfully', {}, 200);
    } catch (error) {
      logger.error('Controller error in deleteMessage', error);
      next(error);
    }
  }

  /**
   * GET /api/chat/sessions
   * Get all chat sessions for the authenticated user.
   */
  async getSessions(req, res, next) {
    try {
      const userId = req.user.id;
      const sessions = await ChatbotService.getSessions(userId);

      return ApiResponse.success(res, 'Chat sessions fetched successfully', sessions, 200);
    } catch (error) {
      logger.error('Controller error in getSessions', error);
      next(error);
    }
  }

  /**
   * PUT /api/chat/session/:id
   * Rename a chat session (where :id is the sessionId string).
   */
  async renameSession(req, res, next) {
    try {
      const userId = req.user.id;
      const sessionId = req.params.id;
      const dto = new RenameSessionDTO(req.body);

      await ChatbotService.renameSession(sessionId, userId, dto.sessionName);

      return ApiResponse.success(res, 'Session renamed successfully', { sessionId, sessionName: dto.sessionName }, 200);
    } catch (error) {
      logger.error('Controller error in renameSession', error);
      next(error);
    }
  }
}

module.exports = new ChatbotController();
