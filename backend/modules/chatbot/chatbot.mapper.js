'use strict';

const {
  ChatMessageResponseDTO,
  ChatHistoryItemDTO,
  ChatSessionDTO,
} = require('./chatbot.dto');
const { CHAT_ROLES } = require('./chatbot.constants');

/**
 * Mapper helper class for the Chatbot module.
 * Transforms between raw data, DB entities, and DTOs.
 */
class ChatbotMapper {
  /**
   * Map input DTO + AI response to a MongoDB-ready entity.
   */
  toEntity(dto, userId, reply) {
    return {
      userId,
      message: dto.message,
      reply,
      role: CHAT_ROLES.USER,
      sessionId: dto.sessionId,
      sessionName: dto.sessionName || 'New Chat',
      language: 'auto',
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      timestamp: new Date(),
    };
  }

  /**
   * Map AI reply string to Response DTO.
   */
  toResponseDTO(reply) {
    return new ChatMessageResponseDTO(reply, new Date().toISOString());
  }

  /**
   * Map array of DB documents to clean history item DTOs.
   */
  toHistoryDTOList(records) {
    return records.map((rec) => new ChatHistoryItemDTO(rec));
  }

  /**
   * Map aggregated session data to session DTOs.
   */
  toSessionDTOList(sessions) {
    return sessions.map((s) => new ChatSessionDTO(s));
  }
}

module.exports = new ChatbotMapper();
