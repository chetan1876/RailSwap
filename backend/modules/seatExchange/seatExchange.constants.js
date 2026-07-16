// ==========================================
// Seat Exchange Constants
// ==========================================

// Request Status
const REQUEST_STATUS = {
  PENDING: "PENDING",
  MATCHED: "MATCHED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
};

// Seat Preferences
const SEAT_PREFERENCE = {
  LOWER: "Lower Berth",
  MIDDLE: "Middle Berth",
  UPPER: "Upper Berth",
  SIDE_LOWER: "Side Lower",
  SIDE_UPPER: "Side Upper",
  WINDOW: "Window Seat",
  ANY: "Any",
};

// Gender
const GENDER = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

// Match Percentage
const MATCH_PERCENTAGE = {
  MIN: 0,
  MAX: 100,
};

// Messages
const MESSAGE = {
  REQUEST_CREATED: "Seat exchange request created successfully.",
  REQUEST_UPDATED: "Seat exchange request updated successfully.",
  REQUEST_ACCEPTED: "Seat exchange request accepted successfully.",
  REQUEST_REJECTED: "Seat exchange request rejected successfully.",
  REQUEST_CANCELLED: "Seat exchange request cancelled successfully.",
  REQUEST_NOT_FOUND: "Seat exchange request not found.",
  MATCH_FOUND: "Matching passengers found.",
  NO_MATCH_FOUND: "No matching passengers found.",
};

// Export
module.exports = {
  REQUEST_STATUS,
  SEAT_PREFERENCE,
  GENDER,
  MATCH_PERCENTAGE,
  MESSAGE,
};