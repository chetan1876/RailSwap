const mongoose = require("mongoose");

const seatExchangeSchema = new mongoose.Schema(
  {
    // User Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Passenger Details
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    // Train Details
    pnr: {
      type: String,
      required: true,
      trim: true,
    },

    trainNumber: {
      type: String,
      required: true,
      trim: true,
    },

    trainName: {
      type: String,
      required: true,
      trim: true,
    },

    journeyDate: {
      type: Date,
      required: true,
    },

    boardingStation: {
      type: String,
      required: true,
      trim: true,
    },

    destinationStation: {
      type: String,
      required: true,
      trim: true,
    },

    // Current Seat
    coach: {
      type: String,
      required: true,
      trim: true,
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    seatType: {
      type: String,
      enum: [
        "Lower Berth",
        "Middle Berth",
        "Upper Berth",
        "Side Lower",
        "Side Upper",
        "Window Seat",
      ],
      required: true,
    },

    // Requested Seat
    preferredSeat: {
      type: String,
      enum: [
        "Lower Berth",
        "Middle Berth",
        "Upper Berth",
        "Side Lower",
        "Side Upper",
        "Window Seat",
        "Any",
      ],
      required: true,
    },

    // Matching Score
    matchPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Exchange Status
    status: {
      type: String,
      enum: [
        "PENDING",
        "MATCHED",
        "ACCEPTED",
        "REJECTED",
        "CANCELLED",
        "COMPLETED",
      ],
      default: "PENDING",
    },

    // Accepted Passenger
    matchedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster search
seatExchangeSchema.index({
  trainNumber: 1,
  journeyDate: 1,
  boardingStation: 1,
  destinationStation: 1,
});

module.exports = mongoose.model("SeatExchange", seatExchangeSchema);