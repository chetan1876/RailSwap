/**
 * Data Transfer Objects for the Chatbot Module.
 */

export class ChatMessageInputDTO {
  constructor(data) {
    this.message = data.message;
    this.sessionId = data.sessionId || 'default';
  }
}

export class ChatMessageResponseDTO {
  constructor(reply) {
    this.reply = reply;
  }
}

export class ChatHistoryItemDTO {
  constructor(model) {
    this.id = model._id || model.id;
    this.message = model.message;
    this.reply = model.reply;
    this.role = model.role;
    this.sessionId = model.sessionId;
    this.timestamp = model.timestamp || model.createdAt;
  }
}
