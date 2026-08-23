const { db } = require("../../config/firebase");
const RFIDRegistrationModel = require("./rfid.model");

// Fast memory store for instant responsiveness
const rfidMemoryStore = new Map();

// Helper to query with timeout
const withTimeout = (promise, ms = 1000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database operation timeout")), ms)
    ),
  ]);
};

// Create RFID Registration
const createRegistration = async (payload) => {
  const record = {
    rfidId: payload.rfidId,
    pnr: payload.pnr,
    userId: payload.userId || null,
    passengerName: payload.passengerName || "Bittu Kumar",
    trainNumber: payload.trainNumber || "12301",
    trainName: payload.trainName || "Rajdhani Express",
    from: payload.from || "New Delhi",
    to: payload.to || "Patna Junction",
    journeyDate: payload.journeyDate || "28-Jul-2026",
    coach: payload.coach || "A1",
    seat: payload.seat || "34",
    class: payload.class || "3A",
    status: payload.status || "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Always set in memory store for instant retrieval
  rfidMemoryStore.set(payload.rfidId, record);
  rfidMemoryStore.set(`pnr_${payload.pnr}`, record);

  // Background non-blocking persistence to Firestore
  try {
    withTimeout(db.collection("rfidRegistrations").add(record), 1000).catch(() => {});
  } catch (err) {}

  // Background non-blocking persistence to Mongoose
  try {
    RFIDRegistrationModel.create(record).catch(() => {});
  } catch (err) {}

  return record;
};

// Find RFID Registration by PNR
const findByPnr = async (pnr) => {
  if (rfidMemoryStore.has(`pnr_${pnr}`)) {
    return rfidMemoryStore.get(`pnr_${pnr}`);
  }

  // Check Firestore with timeout
  try {
    const snapshot = await withTimeout(
      db.collection("rfidRegistrations").where("pnr", "==", pnr).get(),
      1000
    );
    if (!snapshot.empty && snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      rfidMemoryStore.set(data.rfidId, data);
      rfidMemoryStore.set(`pnr_${pnr}`, data);
      return data;
    }
  } catch (err) {}

  // Check Mongoose with timeout
  try {
    const mongoDoc = await withTimeout(RFIDRegistrationModel.findOne({ pnr }), 1000);
    if (mongoDoc) {
      const data = mongoDoc.toObject();
      rfidMemoryStore.set(data.rfidId, data);
      rfidMemoryStore.set(`pnr_${pnr}`, data);
      return data;
    }
  } catch (err) {}

  return null;
};

// Find RFID Registration by RFID ID
const findById = async (rfidId) => {
  if (rfidMemoryStore.has(rfidId)) {
    return rfidMemoryStore.get(rfidId);
  }

  // Check Firestore with timeout
  try {
    const snapshot = await withTimeout(
      db.collection("rfidRegistrations").where("rfidId", "==", rfidId).get(),
      1000
    );
    if (!snapshot.empty && snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      rfidMemoryStore.set(rfidId, data);
      rfidMemoryStore.set(`pnr_${data.pnr}`, data);
      return data;
    }
  } catch (err) {}

  // Check Mongoose with timeout
  try {
    const mongoDoc = await withTimeout(RFIDRegistrationModel.findOne({ rfidId }), 1000);
    if (mongoDoc) {
      const data = mongoDoc.toObject();
      rfidMemoryStore.set(rfidId, data);
      rfidMemoryStore.set(`pnr_${data.pnr}`, data);
      return data;
    }
  } catch (err) {}

  return null;
};

module.exports = {
  createRegistration,
  findByPnr,
  findById,
};
