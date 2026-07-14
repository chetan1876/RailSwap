import { ChatMessageResponseDTO, ChatHistoryItemDTO } from './chatbot.dto.js';
import { CHAT_ROLES } from './chatbot.constants.js';

/**
 * Mapper helper class for the Chatbot module.
 */
class ChatbotMapper {
  /**
   * Map input message and AI response to Mongoose entity structure.
   * @param {ChatMessageInputDTO} dto 
   * @param {string} userId 
   * @param {string} reply 
   * @returns {object} DB Entity save format
   */
  toEntity(dto, userId, reply) {
    return {
      userId,
      message: dto.message,
      reply,
      role: CHAT_ROLES.USER,
      sessionId: dto.sessionId,
      timestamp: new Date()
    };
  }

  /**
   * Format generative AI reply into standard Response DTO.
   * @param {string} reply 
   * @returns {ChatMessageResponseDTO}
   */
  toResponseDTO(reply) {
    return new ChatMessageResponseDTO(reply);
  }

  /**
   * Format array of DB documents into clean user-facing history items.
   * @param {object[]} records 
   * @returns {ChatHistoryItemDTO[]}
   */
  toHistoryDTOList(records) {
    return records.map((rec) => new ChatHistoryItemDTO(rec));
  }
}

export default new ChatbotMapper();
