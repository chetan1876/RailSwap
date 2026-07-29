const { db } = require("../../config/firebase");

// Create Seat Exchange Request
const createRequest = async (payload) => {
  const docRef = await db.collection("seatExchange").add({
    ...payload,
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    id: docRef.id,
    ...payload,
    status: "PENDING",
  };
};

// Get All Requests
const getAllRequests = async () => {
  const snapshot = await db
    .collection("seatExchange")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get Request By ID
const getRequestById = async (id) => {
  const doc = await db.collection("seatExchange").doc(id).get();

  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
};

// Get User Request
const getUserRequest = async (userId) => {
  const snapshot = await db
    .collection("seatExchange")
    .where("user", "==", userId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
};

// Find Matching Passengers
const findMatches = async (
  trainNumber,
  journeyDate,
  boardingStation,
  destinationStation,
  preferredSeat
) => {
  const snapshot = await db
    .collection("seatExchange")
    .where("trainNumber", "==", trainNumber)
    .where("journeyDate", "==", journeyDate)
    .where("boardingStation", "==", boardingStation)
    .where("destinationStation", "==", destinationStation)
    .where("seatType", "==", preferredSeat)
    .where("status", "==", "PENDING")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update Request
const updateRequest = async (id, data) => {
  await db.collection("seatExchange").doc(id).update({
    ...data,
    updatedAt: new Date(),
  });

  return await getRequestById(id);
};

// Delete Request
const deleteRequest = async (id) => {
  await db.collection("seatExchange").doc(id).delete();

  return {
    success: true,
    message: "Request deleted successfully",
  };
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  getUserRequest,
  findMatches,
  updateRequest,
  deleteRequest,
};