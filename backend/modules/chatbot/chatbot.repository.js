import Chatbot from './chatbot.model.js';

/**
 * Data Access Layer repository for Chatbot module.
 */
class ChatbotRepository {
  /**
   * Persist a question-response interaction.
   * @param {object} chatData 
   * @returns {Promise<Document>}
   */
  async saveMessage(chatData) {
    const chatRecord = new Chatbot(chatData);
    return await chatRecord.save();
  }

  /**
   * Fetch paginated or history tail of a conversation.
   * @param {string} userId 
   * @param {string} sessionId 
   * @param {number} limit 
   * @returns {Promise<Document[]>} Chronological conversation logs
   */
  async fetchHistory(userId, sessionId = 'default', limit = 20) {
    // Get last N messages sorted by timestamp descending
    const history = await Chatbot.find({ userId, sessionId })
      .sort({ timestamp: -1 })
      .limit(limit);
      
    // Reverse to chronological order (oldest to newest)
    return history.reverse();
  }

  /**
   * Delete conversation logs for a user.
   * @param {string} userId 
   * @param {string} sessionId 
   * @returns {Promise<object>} Deletion metadata
   */
  async clearHistory(userId, sessionId = 'default') {
    return await Chatbot.deleteMany({ userId, sessionId });
  }
}

export default new ChatbotRepository();
