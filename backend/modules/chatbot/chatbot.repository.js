'use strict';

const Chatbot = require('./chatbot.model');
const mongoose = require('mongoose');

/**
 * Data Access Layer repository for the Chatbot module.
 */
class ChatbotRepository {
  /**
   * Persist a question-response interaction.
   */
  async saveMessage(chatData) {
    const record = new Chatbot(chatData);
    return await record.save();
  }

  /**
   * Fetch paginated conversation history for a user+session.
   * Returns chronological order (oldest → newest).
   */
  async fetchHistory(userId, sessionId = 'default', limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const total = await Chatbot.countDocuments({ userId, sessionId, isDeleted: false });

    const records = await Chatbot.find({ userId, sessionId, isDeleted: false })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Reverse to chronological order (oldest first for display)
    return {
      messages: records.reverse(),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    };
  }

  /**
   * Fetch last N messages for AI context (no pagination).
   */
  async fetchContextWindow(userId, sessionId = 'default', limit = 15) {
    const records = await Chatbot.find({ userId, sessionId, isDeleted: false })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();
    return records.reverse();
  }

  /**
   * Delete all conversation logs for a user's session.
   */
  async clearHistory(userId, sessionId = 'default') {
    return await Chatbot.deleteMany({ userId, sessionId });
  }

  /**
   * Soft-delete a single message by ID (user must own it).
   */
  async deleteMessageById(id, userId) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Chatbot.findOneAndUpdate(
      { _id: id, userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  /**
   * Get all unique sessions for a user (aggregated).
   */
  async getSessions(userId) {
    return await Chatbot.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$sessionId',
          sessionId: { $first: '$sessionId' },
          sessionName: { $first: '$sessionName' },
          lastMessage: { $first: '$message' },
          lastReply: { $first: '$reply' },
          timestamp: { $first: '$timestamp' },
          messageCount: { $sum: 1 },
        },
      },
      { $sort: { timestamp: -1 } },
    ]);
  }

  /**
   * Rename all messages in a session for a user.
   */
  async renameSession(sessionId, userId, newName) {
    return await Chatbot.updateMany(
      { sessionId, userId },
      { $set: { sessionName: newName } }
    );
  }

  /**
   * Check if a session exists for a user.
   */
  async sessionExists(sessionId, userId) {
    return await Chatbot.exists({ sessionId, userId, isDeleted: false });
  }
}

module.exports = new ChatbotRepository();
