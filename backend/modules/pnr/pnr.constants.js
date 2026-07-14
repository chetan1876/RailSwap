<<<<<<< Updated upstream
// PNR Status
const PNR_STATUS = {
  CONFIRMED: "Confirmed",
  RAC: "RAC",
  WAITING: "Waiting",
  CANCELLED: "Cancelled",
};

// Success & Error Messages
const PNR_MESSAGES = {
  VERIFIED: "PNR verified successfully.",
  NOT_FOUND: "PNR not found.",
  INVALID: "Invalid PNR number.",
  SERVER_ERROR: "Something went wrong. Please try again.",
};

module.exports = {
  PNR_STATUS,
  PNR_MESSAGES,
};
=======
module.exports = {
    EXCHANGE_STATUS: {
        PENDING: 'PENDING',
        ACCEPTED: 'ACCEPTED',
        REJECTED: 'REJECTED',
        COMPLETED: 'COMPLETED'
    },
    BERTH_TYPES: ['LB', 'MB', 'UB', 'SL', 'SU', 'SIDE_LOWER', 'SIDE_UPPER', 'UPPER', 'MIDDLE', 'LOWER'],
    MESSAGES: {
        CREATED: 'Seat exchange request placed successfully',
        ACCEPTED: 'Seat exchange request accepted successfully',
        REJECTED: 'Seat exchange request rejected successfully',
        INVALID_BERTH: 'Invalid berth type provided',
        NOT_FOUND: 'Exchange request not found',
        REQUIRED_FIELDS: 'Train number, current seat, current berth, and desired berth are required'
    }
};
>>>>>>> Stashed changes
