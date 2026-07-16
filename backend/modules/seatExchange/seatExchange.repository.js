const SeatExchange = require("./seatExchange.model");

// Create Seat Exchange Request
const createRequest = async (payload) => {
  return await SeatExchange.create(payload);
};

// Get All Requests
const getAllRequests = async () => {
  return await SeatExchange.find()
    .populate("user", "name email")
    .populate("matchedUser", "name email")
    .sort({ createdAt: -1 });
};

// Get Request By ID
const getRequestById = async (id) => {
  return await SeatExchange.findById(id)
    .populate("user", "name email")
    .populate("matchedUser", "name email");
};

// Get User Request
const getUserRequest = async (userId) => {
  return await SeatExchange.findOne({ user: userId });
};

// Find Matching Passengers
const findMatches = async (
  trainNumber,
  journeyDate,
  boardingStation,
  destinationStation,
  preferredSeat
) => {
  return await SeatExchange.find({
    trainNumber,
    journeyDate,
    boardingStation,
    destinationStation,
    seatType: preferredSeat,
    status: "PENDING",
  });
};

// Update Request
const updateRequest = async (id, data) => {
  return await SeatExchange.findByIdAndUpdate(id, data, {
    new: true,
  });
};

// Delete Request
const deleteRequest = async (id) => {
  return await SeatExchange.findByIdAndDelete(id);
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