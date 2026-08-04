"use strict";

const { db } = require("../../config/firebase");
const { COLLECTIONS } = require("./chatbot.constants");

const sessionCollection = db.collection(COLLECTIONS.SESSIONS);
const messageCollection = db.collection(COLLECTIONS.MESSAGES);

/**
 * Helper to safely extract milliseconds from Firestore timestamp / Date / serialized object.
 */
const getMillis = (val) => {
  if (!val) return 0;
  if (typeof val.toDate === "function") return val.toDate().getTime();
  if (val.seconds !== undefined) {
    return val.seconds * 1000 + Math.floor((val.nanoseconds || 0) / 1000000);
  }
  if (val._seconds !== undefined) {
    return val._seconds * 1000 + Math.floor((val._nanoseconds || 0) / 1000000);
  }
  return new Date(val).getTime();
};

/*
========================================
CREATE CHAT SESSION
========================================
*/
const createSession = async (userId, title = "New Chat") => {
  const sessionRef = sessionCollection.doc();

  const session = {
    id: sessionRef.id,
    userId,
    title,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await sessionRef.set(session);
  return session;
};

/*
========================================
GET SESSION
========================================
*/
const getSession = async (sessionId) => {
  const doc = await sessionCollection.doc(sessionId).get();
  if (!doc.exists) return null;
  return doc.data();
};

/*
========================================
SAVE MESSAGE
========================================
*/
const saveMessage = async (sessionId, role, content) => {
  const messageRef = messageCollection.doc();

  const message = {
    id: messageRef.id,
    sessionId,
    role,
    content,
    createdAt: new Date(),
  };

  await messageRef.set(message);

  await sessionCollection.doc(sessionId).update({
    updatedAt: new Date(),
  });

  return message;
};

/*
========================================
GET CHAT HISTORY (SORTED IN-MEMORY TO PREVENT INDEX ERRORS)
========================================
*/
const getMessages = async (sessionId) => {
  const snapshot = await messageCollection
    .where("sessionId", "==", sessionId)
    .get();

  const messages = snapshot.docs.map((doc) => doc.data());

  messages.sort((a, b) => getMillis(a.createdAt) - getMillis(b.createdAt));

  return messages;
};

/*
========================================
GET USER SESSIONS (SORTED IN-MEMORY TO PREVENT INDEX ERRORS)
========================================
*/
const getSessions = async (userId) => {
  const snapshot = await sessionCollection.where("userId", "==", userId).get();

  const sessions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  sessions.sort((a, b) => {
    const aTime = getMillis(a.updatedAt || a.createdAt);
    const bTime = getMillis(b.updatedAt || b.createdAt);
    return bTime - aTime; // descending (newest first)
  });

  return sessions;
};

/*
========================================
RENAME SESSION
========================================
*/
const renameSession = async (sessionId, title) => {
  await sessionCollection.doc(sessionId).update({
    title,
    updatedAt: new Date(),
  });
};

/*
========================================
UPDATE SESSION TITLE (COMPATIBILITY WRAPPER)
========================================
*/
const updateSessionTitle = async (sessionId, title) => {
  await renameSession(sessionId, title);
};

/*
========================================
DELETE SESSION
========================================
*/
const deleteSession = async (sessionId) => {
  const snapshot = await messageCollection
    .where("sessionId", "==", sessionId)
    .get();

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(sessionCollection.doc(sessionId));

  await batch.commit();
};

/*
========================================
CLEAR ALL HISTORY
========================================
*/
const clearHistory = async (userId) => {
  const sessions = await getSessions(userId);
  for (const session of sessions) {
    await deleteSession(session.id);
  }
};

/*
========================================
SEARCH CHAT
========================================
*/
const searchChats = async (userId, keyword) => {
  const sessions = await getSessions(userId);
  return sessions.filter((session) =>
    (session.title || "").toLowerCase().includes((keyword || "").toLowerCase()),
  );
};

module.exports = {
  createSession,
  getSession,
  saveMessage,
  getMessages,
  getSessions,
  renameSession,
  deleteSession,
  clearHistory,
  updateSessionTitle,
  searchChats,
};
