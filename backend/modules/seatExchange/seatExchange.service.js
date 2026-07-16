const repository = require("./seatExchange.repository");
const { REQUEST_STATUS, MESSAGE } = require("./seatExchange.constants");

// Create Seat Exchange Request
const createSeatExchangeRequest = async (data) => {
  const request = await repository.createRequest(data);

  return {
    success: true,
    message: MESSAGE.REQUEST_CREATED,
    data: request,
  };
};

// Get All Requests
const getAllSeatExchangeRequests = async () => {
  const requests = await repository.getAllRequests();

  return {
    success: true,
    count: requests.length,
    data: requests,
  };
};

// Get Request By ID
const getSeatExchangeRequestById = async (id) => {
  const request = await repository.getRequestById(id);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  return {
    success: true,
    data: request,
  };
};

// Find Matching Passengers
const findMatchingPassengers = async (requestData) => {
  const matches = await repository.findMatches(
    requestData.trainNumber,
    requestData.journeyDate,
    requestData.boardingStation,
    requestData.destinationStation,
    requestData.preferredSeat
  );

  return {
    success: true,
    message: matches.length
      ? MESSAGE.MATCH_FOUND
      : MESSAGE.NO_MATCH_FOUND,
    count: matches.length,
    data: matches,
  };
};

// Accept Request
const acceptSeatExchange = async (id, matchedUserId) => {
  const request = await repository.getRequestById(id);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  const updated = await repository.updateRequest(id, {
    status: REQUEST_STATUS.ACCEPTED,
    matchedUser: matchedUserId,
  });

  return {
    success: true,
    message: MESSAGE.REQUEST_ACCEPTED,
    data: updated,
  };
};

// Reject Request
const rejectSeatExchange = async (id) => {
  const request = await repository.getRequestById(id);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  const updated = await repository.updateRequest(id, {
    status: REQUEST_STATUS.REJECTED,
  });

  return {
    success: true,
    message: MESSAGE.REQUEST_REJECTED,
    data: updated,
  };
};

// Cancel Request
const cancelSeatExchange = async (id) => {
  const request = await repository.getRequestById(id);

  if (!request) {
    throw new Error(MESSAGE.REQUEST_NOT_FOUND);
  }

  const updated = await repository.updateRequest(id, {
    status: REQUEST_STATUS.CANCELLED,
  });

  return {
    success: true,
    message: MESSAGE.REQUEST_CANCELLED,
    data: updated,
  };
};

module.exports = {
  createSeatExchangeRequest,
  getAllSeatExchangeRequests,
  getSeatExchangeRequestById,
  findMatchingPassengers,
  acceptSeatExchange,
  rejectSeatExchange,
  cancelSeatExchange,
};