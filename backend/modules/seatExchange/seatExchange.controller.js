const seatExchangeService = require("./seatExchange.service");

// Create Seat Exchange Request
const createSeatExchangeRequest = async (req, res, next) => {
  try {
    const result = await seatExchangeService.createSeatExchangeRequest(req.body);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Get All Requests
const getAllSeatExchangeRequests = async (req, res, next) => {
  try {
    const result = await seatExchangeService.getAllSeatExchangeRequests();

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Get Request By ID
const getSeatExchangeRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await seatExchangeService.getSeatExchangeRequestById(id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Find Matching Passengers
const findMatchingPassengers = async (req, res, next) => {
  try {
    const result = await seatExchangeService.findMatchingPassengers(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Accept Seat Exchange
const acceptSeatExchange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { matchedUserId } = req.body;

    const result = await seatExchangeService.acceptSeatExchange(
      id,
      matchedUserId
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Reject Seat Exchange
const rejectSeatExchange = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await seatExchangeService.rejectSeatExchange(id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Cancel Seat Exchange
const cancelSeatExchange = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await seatExchangeService.cancelSeatExchange(id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
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