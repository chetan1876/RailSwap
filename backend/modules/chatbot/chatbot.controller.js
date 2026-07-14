import ChatbotService from './chatbot.service.js';
import { ChatMessageInputDTO } from './chatbot.dto.js';
import ApiResponse from '../../shared/apiResponse.js';
import { logger } from '../../shared/logger.js';

/**
 * Controller class to handle routes associated with the Chatbot Module.
 */
class ChatbotController {
  /**
   * Post message and retrieve response from AI Railway Assistant.
   * Route: POST /api/chat/message
   */
  async sendMessage(req, res, next) {
    try {
      // 1. Map input body using Input DTO
      const inputDto = new ChatMessageInputDTO(req.body);
      
      // 2. Extract userId from request (injected by AuthMiddleware)
      const userId = req.user.id;

      // 3. Delegate to Service Layer
      const responseDto = await ChatbotService.processUserMessage(inputDto, userId);

      // 4. Return success response mapping standard envelope
      return ApiResponse.success(
        res,
        'Assistant reply generated successfully',
        responseDto,
        200
      );
    } catch (error) {
      logger.error('Controller error in sendMessage', error);
      next(error);
    }
  }

  /**
   * Fetch conversation log history.
   * Route: GET /api/chat/history
   */
  async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const sessionId = req.query.sessionId || 'default';
      const limit = parseInt(req.query.limit, 10) || 50;

      const historyData = await ChatbotService.getUserChatHistory(userId, sessionId, limit);

      return ApiResponse.success(
        res,
        'Chat history fetched successfully',
        historyData,
        200
      );
    } catch (error) {
      logger.error('Controller error in getHistory', error);
      next(error);
    }
  }

  /**
   * Delete conversation logs.
   * Route: DELETE /api/chat/history
   */
  async clearHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const sessionId = req.query.sessionId || 'default';

      await ChatbotService.clearUserChatHistory(userId, sessionId);

      return ApiResponse.success(
        res,
        'Chat history cleared successfully',
        {},
        200
      );
    } catch (error) {
      logger.error('Controller error in clearHistory', error);
      next(error);
    }
  }
}

export default new ChatbotController();
