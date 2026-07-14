'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');

let _client = null;

/**
 * Returns a lazily-initialised GoogleGenerativeAI client.
 * The key is read from process.env at call time so dotenv is always loaded first.
 * @returns {GoogleGenerativeAI}
 */
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Add GEMINI_API_KEY=your_key to .env file. ' +
      'Get a free key at https://aistudio.google.com/apikey'
    );
  }

  if (!_client) {
    _client = new GoogleGenerativeAI(apiKey);
  }

  return _client;
};

/**
 * Reset the cached client (useful for key rotation or tests).
 */
const resetGeminiClient = () => {
  _client = null;
};

module.exports = { getGeminiClient, resetGeminiClient };
