"use strict";

const repository = require("./chatbot.repository");
const { getGeminiClient } = require("../../config/gemini");
const { SYSTEM_PROMPT } = require("./chatbot.prompts");
const { MODEL, MODELS, ROLES, MAX_HISTORY } = require("./chatbot.constants");

/*
========================================
HELPER: SMART FALLBACK RESPONSE
========================================
*/
const getFallbackReply = (userMessage) => {
  const msg = (userMessage || "").toLowerCase().trim();

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg === "greetings") {
    return "Hello! I am your RailSwap AI Assistant. How can I assist you with your railway journey today?";
  }

  if (msg.includes("what is railswap") || msg.includes("railswap")) {
    return "RailSwap is a smart railway passenger assistance platform designed to make train travel seamless. Features include Seat Exchange, PNR Verification, Live Train Delay Tracking, Lost Item AI reporting, Digital RFID Registration, and Emergency Medical assistance.";
  }

  if (msg.includes("seat exchange") || msg.includes("swap seat") || msg.includes("exchange seat")) {
    return "Seat Exchange allows passengers to request or swap seats with fellow travelers on the same train to get preferred berths or sit together with family members.";
  }

  if (msg.includes("verify") || msg.includes("pnr")) {
    return "You can verify your PNR by navigating to the PNR Verification section on RailSwap and entering your 10-digit PNR number to view journey status and coach position.";
  }

  if (msg.includes("lost") || msg.includes("bag") || msg.includes("item")) {
    return "If you lose an item during your journey, go to the 'Lost Item AI' section on RailSwap, enter your PNR and item details to register a lost item claim.";
  }

  if (msg.includes("rfid")) {
    return "PNR to RFID Registration generates a unique digital RFID identity (e.g. RFID-RS-XXXXXXXX) for your journey, which can be linked to your physical luggage tag for baggage identification.";
  }

  return "I'm currently unable to connect to the AI service, but I can still help you with RailSwap features like PNR verification, seat exchange, train status, lost item reporting, RFID registration, and emergency assistance.";
};

/*
========================================
GENERATE CHAT TITLE
========================================
*/
const generateChatTitle = async (message) => {
  try {
    const client = getGeminiClient();
    const modelList = MODELS || [MODEL, "gemini-2.5-flash", "gemini-3.6-flash"];

    for (const modelName of modelList) {
      try {
        const model = client.getGenerativeModel({ model: modelName });
        const prompt = `Generate a very short chat title (maximum 4 words) for: "${message}". Only return the title.`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        if (text) return text.replace(/["']/g, "").slice(0, 40);
      } catch (err) {}
    }
  } catch (error) {
    console.warn("Notice: Title generation fallback to default title.");
  }
  return message ? message.slice(0, 30) : "New Chat";
};

/*
========================================
SEND MESSAGE
========================================
*/
const sendMessage = async ({ userId, sessionId, message }) => {
  const cleanMessage = (message || "").trim();

  // 1. Session Setup
  let session = null;
  if (!sessionId || sessionId === "null" || sessionId === "undefined") {
    const title = await generateChatTitle(cleanMessage);
    session = await repository.createSession(userId, title);
    sessionId = session.id;
  } else {
    session = await repository.getSession(sessionId);
    if (!session) {
      session = await repository.createSession(userId, "New Chat");
      sessionId = session.id;
    }
  }

  // 2. Format Chat History
  const history = await repository.getMessages(sessionId);
  const filtered = [];
  let expectedRole = "user";
  for (const msg of history) {
    const role = msg.role === ROLES.USER ? "user" : "model";
    if (role === expectedRole) {
      filtered.push({
        role,
        parts: [{ text: msg.content || "" }],
      });
      expectedRole = expectedRole === "user" ? "model" : "user";
    }
  }

  if (filtered.length > 0 && filtered[filtered.length - 1].role === "user") {
    filtered.pop();
  }

  let sliceCount = MAX_HISTORY;
  if (sliceCount % 2 !== 0) sliceCount--;
  const formattedHistory = filtered.slice(-sliceCount);

  // 3. Attempt Gemini API call across supported candidate models
  let reply = null;
  const candidateModels = [MODEL, "gemini-2.5-flash", "gemini-3.6-flash"].filter(Boolean);

  try {
    const client = getGeminiClient();

    for (const modelName of candidateModels) {
      try {
        const model = client.getGenerativeModel({
          model: modelName,
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

        const TIMEOUT_MS = 15000;
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini AI request timeout")), TIMEOUT_MS)
        );

        const result = await Promise.race([chat.sendMessage(cleanMessage), timeoutPromise]);
        const text = result.response.text();
        if (text && text.trim()) {
          reply = text.trim();
          break; // Successfully got answer from Gemini API!
        }
      } catch (err) {
        console.warn(`Gemini model ${modelName} note:`, err.message);
      }
    }
  } catch (clientErr) {
    console.warn("Gemini client note:", clientErr.message);
  }

  // 4. Fallback Handling if Gemini API fails or returns empty
  if (!reply) {
    reply = getFallbackReply(cleanMessage);
  }

  // 5. Save History & Return
  try {
    await repository.saveMessage(sessionId, ROLES.USER, cleanMessage);
    await repository.saveMessage(sessionId, ROLES.ASSISTANT, reply);
  } catch (saveErr) {
    console.warn("Message history save warning:", saveErr.message);
  }

  return {
    sessionId,
    reply,
  };
};

/*
========================================
NEW CHAT & HISTORY EXPORTS
========================================
*/
const createChat = async (userId) => {
  return await repository.createSession(userId, "New Chat");
};

const getHistory = async (userId) => {
  return await repository.getSessions(userId);
};

const getChat = async (sessionId) => {
  return await repository.getMessages(sessionId);
};

const renameChat = async (sessionId, title) => {
  await repository.renameSession(sessionId, title);
};

const deleteChat = async (sessionId) => {
  await repository.deleteSession(sessionId);
};

const clearHistory = async (userId) => {
  await repository.clearHistory(userId);
};

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
