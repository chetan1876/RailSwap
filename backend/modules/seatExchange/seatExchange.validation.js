const Joi = require("joi");

// Create Seat Exchange Request
const createSeatExchangeValidation = Joi.object({
  passengerName: Joi.string().trim().min(3).max(50).required(),

  age: Joi.number().integer().min(1).max(120).required(),

  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .required(),

  pnr: Joi.string()
    .length(10)
    .required(),

  trainNumber: Joi.string()
    .required(),

  trainName: Joi.string()
    .required(),

  journeyDate: Joi.date()
    .required(),

  boardingStation: Joi.string()
    .required(),

  destinationStation: Joi.string()
    .required(),

  coach: Joi.string()
    .required(),

  seatNumber: Joi.string()
    .required(),

  seatType: Joi.string()
    .valid(
      "Lower Berth",
      "Middle Berth",
      "Upper Berth",
      "Side Lower",
      "Side Upper",
      "Window Seat"
    )
    .required(),

  preferredSeat: Joi.string()
    .valid(
      "Lower Berth",
      "Middle Berth",
      "Upper Berth",
      "Side Lower",
      "Side Upper",
      "Window Seat",
      "Any"
    )
    .required(),
});

// Update Seat Preference
const updateSeatPreferenceValidation = Joi.object({
  preferredSeat: Joi.string()
    .valid(
      "Lower Berth",
      "Middle Berth",
      "Upper Berth",
      "Side Lower",
      "Side Upper",
      "Window Seat",
      "Any"
    )
    .required(),
});

// Accept / Reject Request
const updateStatusValidation = Joi.object({
  status: Joi.string()
    .valid(
      "ACCEPTED",
      "REJECTED",
      "CANCELLED"
    )
    .required(),
});

module.exports = {
  createSeatExchangeValidation,
  updateSeatPreferenceValidation,
  updateStatusValidation,
};