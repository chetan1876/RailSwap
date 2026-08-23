const mongoose = require("mongoose");

const rfidSchema = new mongoose.Schema(
  {
    rfidId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    pnr: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      default: null,
    },
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },
    trainNumber: {
      type: String,
      required: true,
    },
    trainName: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    journeyDate: {
      type: String,
      required: true,
    },
    coach: {
      type: String,
      required: true,
    },
    seat: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      default: "3A",
    },
    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RFIDRegistration", rfidSchema);
