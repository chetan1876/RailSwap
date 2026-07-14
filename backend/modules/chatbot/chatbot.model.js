import mongoose from 'mongoose';
import { CHAT_ROLES } from './chatbot.constants.js';

const chatbotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true
    },
    reply: {
      type: String,
      required: [true, 'AI reply text is required'],
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(CHAT_ROLES),
      default: CHAT_ROLES.USER
    },
    sessionId: {
      type: String,
      default: 'default',
      index: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Format output JSON properties
chatbotSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

const Chatbot = mongoose.model('Chatbot', chatbotSchema);

export default Chatbot;
