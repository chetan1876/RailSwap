<<<<<<< Updated upstream
const mongoose = require("mongoose");

const pnrSchema = new mongoose.Schema(
  {
    pnr: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
      type: Date,
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

    status: {
      type: String,
      enum: ["Confirmed", "RAC", "Waiting", "Cancelled"],
      default: "Waiting",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PNR", pnrSchema);
=======
const mongoose = require('mongoose');

const pnrLogSchema = new mongoose.Schema({
    pnrNumber: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    trainName: { type: String, required: true },
    sourceStation: { type: String, required: true },
    destinationStation: { type: String, required: true },
    bookingStatus: { type: String, required: true }
}, {
    timestamps: true
});

pnrLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PnrLog', pnrLogSchema);
>>>>>>> Stashed changes
