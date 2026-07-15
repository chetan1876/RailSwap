'use strict';

const { getGeminiClient } = require('../../config/gemini');
const ChatbotRepository = require('./chatbot.repository');
const ChatbotMapper = require('./chatbot.mapper');
const {
  SYSTEM_INSTRUCTIONS,
  GEMINI_CONFIG,
  DEFAULT_SESSION_ID,
} = require('./chatbot.constants');
const ApiError = require('../../shared/apiError');
const { logger } = require('../../shared/logger');

/**
 * Service Layer for the Chatbot Module.
 * Orchestrates Gemini AI calls, retries, persistence, and business logic.
 */
class ChatbotService {
  /**
   * Process a user message: fetch context, call Gemini, persist, return response.
   * @param {import('./chatbot.dto').ChatMessageInputDTO} inputDto
   * @param {string} userId
   * @returns {Promise<import('./chatbot.dto').ChatMessageResponseDTO>}
   */
  async processUserMessage(inputDto, userId) {
    logger.info('Processing chatbot message', { userId, sessionId: inputDto.sessionId });

    // 1. Fetch recent conversation turns for context
    const recentTurns = await ChatbotRepository.fetchContextWindow(
      userId,
      inputDto.sessionId,
      GEMINI_CONFIG.CONTEXT_WINDOW
    );

    // 2. Build Gemini multi-turn history format
    const historyContext = [];
    for (const turn of recentTurns) {
      historyContext.push({ role: 'user', parts: [{ text: turn.message }] });
      historyContext.push({ role: 'model', parts: [{ text: turn.reply }] });
    }

    try {
      // 3. Get lazily-initialised Gemini client
      const genAI = getGeminiClient();
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTIONS,
      });

      // 4. Start multi-turn chat session with injected history context
      const chatSession = model.startChat({
        history: historyContext,
        generationConfig: {
          maxOutputTokens: GEMINI_CONFIG.MAX_OUTPUT_TOKENS,
          temperature: GEMINI_CONFIG.TEMPERATURE,
        },
      });

      // 5. Call Gemini with retry + timeout logic
      let result;
      for (let attempt = 1; attempt <= GEMINI_CONFIG.MAX_RETRIES; attempt++) {
        try {
          const aiPromise = chatSession.sendMessage(inputDto.message);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Gemini API request timed out after 25s')),
              GEMINI_CONFIG.TIMEOUT_MS
            )
          );
          result = await Promise.race([aiPromise, timeoutPromise]);
          break; // success — exit retry loop
        } catch (retryErr) {
          const isRateLimit =
            retryErr.message?.includes('429') ||
            retryErr.message?.includes('quota') ||
            retryErr.message?.includes('Resource') ||
            retryErr.message?.includes('RESOURCE_EXHAUSTED');

          if (isRateLimit && attempt < GEMINI_CONFIG.MAX_RETRIES) {
            const waitMs = attempt * GEMINI_CONFIG.RETRY_DELAY_BASE_MS;
            logger.warn(`Gemini rate-limit hit. Retrying in ${waitMs}ms (attempt ${attempt}/${GEMINI_CONFIG.MAX_RETRIES})`);
            await new Promise((r) => setTimeout(r, waitMs));
          } else {
            throw retryErr;
          }
        }
      }

      const botReply = result.response.text();

      if (!botReply || botReply.trim() === '') {
        throw ApiError.internal('AI returned an empty reply. Please try again.');
      }

      logger.info('Gemini reply generated successfully', { userId, sessionId: inputDto.sessionId });

      // 6. Persist this interaction in MongoDB
      const entity = ChatbotMapper.toEntity(inputDto, userId, botReply);
      await ChatbotRepository.saveMessage(entity);

      return ChatbotMapper.toResponseDTO(botReply);

    } catch (error) {
      logger.error('Error during Gemini AI generation', { message: error.message });

      // Parse Gemini's suggested retry delay if present
      const retryMatch = error.message?.match(/Please retry in ([\d.]+)s/);
      const retrySec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;

      // Daily quota exhausted
      if (error.message?.includes('limit: 0') || error.message?.includes('PerDay') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        const msg = retrySec
          ? `Daily AI quota exhausted. Gemini suggests retrying in ${retrySec} seconds. Get a new key at https://aistudio.google.com/apikey`
          : 'Daily AI quota exhausted. Please try again tomorrow or get a new API key at https://aistudio.google.com/apikey';
        throw new ApiError(429, msg);
      }

      // Per-minute rate limit
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('Resource')) {
        const msg = retrySec
          ? `AI rate limit hit. Please wait ${retrySec} seconds and try again.`
          : 'Too many requests to AI. Please wait a moment and try again.';
        throw new ApiError(429, msg);
      }

      // Timeout
      if (error.message?.includes('timed out')) {
        throw new ApiError(504, 'AI engine timed out. Please resend your message.');
      }

      // API key not configured
      if (error.message?.includes('GEMINI_API_KEY') || error.message?.includes('not configured')) {
        throw ApiError.internal('Gemini API key is not configured. Add GEMINI_API_KEY to .env file.');
      }

      throw ApiError.internal('Failed to generate assistant reply. Please try again.', {
        detail: error.message,
      });
    }
  }

  /**
   * Fetch paginated conversation history.
   */
  async getUserChatHistory(userId, sessionId = DEFAULT_SESSION_ID, limit = 20, page = 1) {
    logger.info('Fetching chat history', { userId, sessionId, page, limit });
    const result = await ChatbotRepository.fetchHistory(userId, sessionId, limit, page);
    return {
      messages: ChatbotMapper.toHistoryDTOList(result.messages),
      pagination: result.pagination,
    };
  }

  /**
   * Clear all messages in a session.
   */
  async clearUserChatHistory(userId, sessionId = DEFAULT_SESSION_ID) {
    logger.info('Clearing chat history', { userId, sessionId });
    const result = await ChatbotRepository.clearHistory(userId, sessionId);
    return { deletedCount: result.deletedCount };
  }

  /**
   * Soft-delete a single message by ID.
   */
  async deleteMessage(messageId, userId) {
    logger.info('Deleting single message', { messageId, userId });
    const deleted = await ChatbotRepository.deleteMessageById(messageId, userId);
    if (!deleted) {
      throw ApiError.notFound('Message not found or already deleted.');
    }
    return true;
  }

  /**
   * Get all chat sessions for a user.
   */
  async getSessions(userId) {
    logger.info('Fetching chat sessions', { userId });
    const sessions = await ChatbotRepository.getSessions(userId);
    return ChatbotMapper.toSessionDTOList(sessions);
  }

  /**
   * Rename a chat session.
   */
  async renameSession(sessionId, userId, newName) {
    logger.info('Renaming session', { sessionId, userId, newName });

    const exists = await ChatbotRepository.sessionExists(sessionId, userId);
    if (!exists) {
      throw ApiError.notFound('Session not found.');
    }

    await ChatbotRepository.renameSession(sessionId, userId, newName);
    return true;
  }
}

module.exports = new ChatbotService();
