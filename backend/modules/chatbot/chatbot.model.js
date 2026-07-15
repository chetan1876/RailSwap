'use strict';

const mongoose = require('mongoose');
const { CHAT_ROLES, DEFAULT_SESSION_ID, DEFAULT_SESSION_NAME } = require('./chatbot.constants');

const chatbotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId is required'],
      index: true,
    },
    sessionId: {
      type: String,
      default: DEFAULT_SESSION_ID,
      index: true,
      trim: true,
    },
    sessionName: {
      type: String,
      default: DEFAULT_SESSION_NAME,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
    },
    reply: {
      type: String,
      required: [true, 'AI reply text is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(CHAT_ROLES),
      default: CHAT_ROLES.USER,
    },
    language: {
      type: String,
      default: 'auto',
      trim: true,
    },
    model: {
      type: String,
      default: 'gemini-2.0-flash',
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user+session queries
chatbotSchema.index({ userId: 1, sessionId: 1, timestamp: -1 });

chatbotSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.isDeleted;
    return ret;
  },
});

const Chatbot = mongoose.model('Chatbot', chatbotSchema);

module.exports = Chatbot;
