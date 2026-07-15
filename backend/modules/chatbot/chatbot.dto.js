'use strict';

const { DEFAULT_SESSION_ID } = require('./chatbot.constants');

/**
 * Data Transfer Objects for the Chatbot Module.
 */

class ChatMessageInputDTO {
  constructor(data) {
    this.message = (data.message || '').trim();
    this.sessionId = (data.sessionId || DEFAULT_SESSION_ID).trim();
    this.sessionName = data.sessionName || null;
  }
}

class ChatMessageResponseDTO {
  constructor(reply, timestamp) {
    this.reply = reply;
    this.timestamp = timestamp || new Date().toISOString();
  }
}

class ChatHistoryItemDTO {
  constructor(model) {
    this.id = model._id || model.id;
    this.message = model.message;
    this.reply = model.reply;
    this.role = model.role;
    this.sessionId = model.sessionId;
    this.sessionName = model.sessionName;
    this.language = model.language;
    this.model = model.model;
    this.timestamp = model.timestamp || model.createdAt;
  }
}

class ChatSessionDTO {
  constructor(session) {
    this.sessionId = session.sessionId;
    this.sessionName = session.sessionName;
    this.lastMessage = session.lastMessage;
    this.lastReply = session.lastReply;
    this.timestamp = session.timestamp;
    this.messageCount = session.messageCount;
  }
}

class RenameSessionDTO {
  constructor(data) {
    this.sessionName = (data.sessionName || '').trim();
  }
}

class DeleteMessageDTO {
  constructor(id) {
    this.id = id;
  }
}

module.exports = {
  ChatMessageInputDTO,
  ChatMessageResponseDTO,
  ChatHistoryItemDTO,
  ChatSessionDTO,
  RenameSessionDTO,
  DeleteMessageDTO,
};
