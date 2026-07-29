"use strict";

const repository = require("./chatbot.repository");
const { getGeminiClient } = require("../../config/gemini");
const { SYSTEM_PROMPT } = require("./chatbot.prompts");
const { MODEL, ROLES, MAX_HISTORY } = require("./chatbot.constants");

/*
========================================
GENERATE CHAT TITLE
========================================
*/
const generateChatTitle = async (message) => {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: MODEL,
    });

    const prompt = `
Generate a very short chat title (maximum 5 words).

User message:
"${message}"

Only return the title.
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim() || "New Chat";
  } catch (error) {
    console.error("Failed to generate chat title, falling back to default:", error);
    return "New Chat";
  }
};

/*
========================================
SEND MESSAGE
========================================
*/
const sendMessage = async ({ userId, sessionId, message }) => {
  let session = null;

  if (!sessionId || sessionId === "null" || sessionId === "undefined") {
    const title = await generateChatTitle(message);
    session = await repository.createSession(userId, title);
    sessionId = session.id;
  } else {
    session = await repository.getSession(sessionId);
    if (!session) {
      throw new Error("Chat session not found");
    }
  }

  const history = await repository.getMessages(sessionId);

  // Filter messages to construct a strict alternating roles array: [user, model, user, model...]
  // In @google/generative-ai, history MUST alternate and must start with 'user' and end with 'model'.
  const filtered = [];
  let expectedRole = "user";
  for (const msg of history) {
    const role = msg.role === ROLES.USER ? "user" : "model";
    if (role === expectedRole) {
      filtered.push({
        role,
        parts: [{ text: msg.content || "" }]
      });
      expectedRole = expectedRole === "user" ? "model" : "user";
    }
  }

  // If the last element is 'user', remove it because the new message we're sending is 'user'
  if (filtered.length > 0 && filtered[filtered.length - 1].role === "user") {
    filtered.pop();
  }

  // Ensure slice length is even for matching user/model pairs
  let sliceCount = MAX_HISTORY;
  if (sliceCount % 2 !== 0) {
    sliceCount--;
  }
  const formattedHistory = filtered.slice(-sliceCount);

  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });

  const chat = model.startChat({
    history: formattedHistory,
  });

  const result = await chat.sendMessage(message);
  const reply = result.response.text().trim();

  // Save the user message and then the AI response
  await repository.saveMessage(sessionId, ROLES.USER, message);
  await repository.saveMessage(sessionId, ROLES.ASSISTANT, reply);

  return {
    sessionId,
    reply,
  };
};

/*
========================================
NEW CHAT
========================================
*/
const createChat = async (userId) => {
  return await repository.createSession(userId, "New Chat");
};

/*
========================================
GET HISTORY
========================================
*/
const getHistory = async (userId) => {
  return await repository.getSessions(userId);
};

/*
========================================
GET CHAT
========================================
*/
const getChat = async (sessionId) => {
  return await repository.getMessages(sessionId);
};

/*
========================================
RENAME CHAT
========================================
*/
const renameChat = async (sessionId, title) => {
  await repository.renameSession(sessionId, title);
};

/*
========================================
DELETE CHAT
========================================
*/
const deleteChat = async (sessionId) => {
  await repository.deleteSession(sessionId);
};

/*
========================================
CLEAR HISTORY
========================================
*/
const clearHistory = async (userId) => {
  await repository.clearHistory(userId);
};

/*
========================================
SEARCH HISTORY
========================================
*/
const searchHistory = async (userId, keyword) => {
  return await repository.searchChats(userId, keyword);
};

module.exports = {
  sendMessage,
  createChat,
  getHistory,
  getChat,
  renameChat,
  deleteChat,
  clearHistory,
  searchHistory,
};
