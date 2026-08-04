"use strict";

const { db } = require("../../config/firebase");
const { getGeminiClient } = require("../../config/gemini");

const MODEL = "gemini-flash-lite-latest";
const COLLECTION = "aiRecommendations";

/**
 * Ask Gemini API to generate content with a system instruction and user prompt.
 * @param {string} prompt - The user prompt details
 * @param {string} systemInstruction - The system context for Gemini
 * @returns {Promise<string>} - The raw text response from Gemini
 */
const askGemini = async (prompt, systemInstruction) => {
  const client = getGeminiClient();

  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemInstruction,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};

/**
 * Saves a new recommendation to the Firestore database.
 * @param {object} recommendationData - The data to save
 * @returns {Promise<object>} - Saved document with generated id
 */
const saveRecommendation = async (recommendationData) => {
  const docRef = await db.collection(COLLECTION).add({
    ...recommendationData,
    createdAt: new Date(),
    isBookmarked: false,
    analytics: {
      views: 1,
      lastViewed: new Date(),
    },
  });

  return {
    id: docRef.id,
    ...recommendationData,
    createdAt: new Date(),
    isBookmarked: false,
  };
};

/**
 * Retrieves the recommendation history for a specific user email.
 * @param {string} userEmail - User's email
 * @returns {Promise<Array>} - List of recommendation history logs
 */
const getHistory = async (userEmail) => {
  const snapshot = await db
    .collection(COLLECTION)
    .where("userEmail", "==", userEmail)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || doc.data().createdAt,
  }));
};

/**
 * Retrieves the recent recommendation history records for a user email.
 * @param {string} userEmail - User's email
 * @param {number} limit - Maximum number of records to return
 * @returns {Promise<Array>} - List of recent recommendation logs
 */
const getRecent = async (userEmail, limit = 5) => {
  const snapshot = await db
    .collection(COLLECTION)
    .where("userEmail", "==", userEmail)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || doc.data().createdAt,
  }));
};

/**
 * Fetches a single recommendation by document ID.
 * @param {string} id - Document ID
 * @returns {Promise<object|null>} - Recommendation document or null
 */
const getById = async (id) => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) {
    return null;
  }

  // Update analytics view count asynchronously
  db.collection(COLLECTION)
    .doc(id)
    .update({
      "analytics.views": (doc.data().analytics?.views || 0) + 1,
      "analytics.lastViewed": new Date(),
    })
    .catch((err) => console.error("Failed to update analytics views:", err));

  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || doc.data().createdAt,
  };
};

/**
 * Toggles or updates the bookmarked state of a recommendation.
 * @param {string} id - Document ID
 * @param {boolean} isBookmarked - New bookmark state
 * @returns {Promise<boolean>} - Success state
 */
const updateBookmark = async (id, isBookmarked) => {
  await db.collection(COLLECTION).doc(id).update({
    isBookmarked: isBookmarked,
  });
  return true;
};

/**
 * Deletes a recommendation by document ID.
 * @param {string} id - Document ID
 * @returns {Promise<boolean>} - Success state
 */
const deleteById = async (id) => {
  await db.collection(COLLECTION).doc(id).delete();
  return true;
};

/**
 * Clears all recommendations history for a user.
 * @param {string} userEmail - User's email
 * @returns {Promise<boolean>} - Success state
 */
const clearHistory = async (userEmail) => {
  const snapshot = await db
    .collection(COLLECTION)
    .where("userEmail", "==", userEmail)
    .get();

  if (snapshot.empty) {
    return true;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  return true;
};

module.exports = {
  askGemini,
  saveRecommendation,
  getHistory,
  getRecent,
  getById,
  updateBookmark,
  deleteById,
  clearHistory,
};
