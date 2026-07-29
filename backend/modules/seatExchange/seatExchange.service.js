const repository = require("./seatExchange.repository");
const { REQUEST_STATUS, MESSAGE } = require("./seatExchange.constants");

const { db, messaging } = require("../../config/firebase");

// =====================================================
// SEND FCM NOTIFICATION
// =====================================================

const sendNotificationToUser = async (
  userId,
  title,
  body
) => {
  try {
    if (!userId) {
      console.warn(
        "Notification skipped: User ID not found"
      );

      return;
    }

    // Get user document
    const userDoc = await db
      .collection("users")
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      console.warn(
        `Notification skipped: User ${userId} not found`
      );

      return;
    }

    const userData = userDoc.data();

    const fcmToken = userData.fcmToken;

    if (!fcmToken) {
      console.warn(
        `Notification skipped: FCM token not found for user ${userId}`
      );

      return;
    }

    // Send FCM notification
    await messaging.send({
      token: fcmToken,

      notification: {
        title,
        body,
      },

      data: {
        type: "SEAT_EXCHANGE",
        userId: String(userId),
      },
    });

    console.log(
      `✅ Notification sent successfully to ${userId}`
    );
  } catch (error) {
    console.error(
      "❌ Notification Send Error:",
      error
    );
  }
};

// =====================================================
// CREATE SEAT EXCHANGE REQUEST
// =====================================================

const createSeatExchangeRequest = async (
  data
) => {
  const request =
    await repository.createRequest(data);

  return {
    success: true,
    message: MESSAGE.REQUEST_CREATED,
    data: request,
  };
};

// =====================================================
// GET ALL REQUESTS
// =====================================================

const getAllSeatExchangeRequests =
  async () => {
    const requests =
      await repository.getAllRequests();

    return {
      success: true,
      count: requests.length,
      data: requests,
    };
  };

// =====================================================
// GET REQUEST BY ID
// =====================================================

const getSeatExchangeRequestById =
  async (id) => {
    const request =
      await repository.getRequestById(id);

    if (!request) {
      throw new Error(
        MESSAGE.REQUEST_NOT_FOUND
      );
    }

    return {
      success: true,
      data: request,
    };
  };

// =====================================================
// FIND MATCHING PASSENGERS
// =====================================================

const findMatchingPassengers =
  async (requestData) => {
    const matches =
      await repository.findMatches(
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

// =====================================================
// ACCEPT SEAT EXCHANGE REQUEST
// =====================================================

const acceptSeatExchange = async (
  id,
  matchedUserId
) => {
  const request =
    await repository.getRequestById(id);

  if (!request) {
    throw new Error(
      MESSAGE.REQUEST_NOT_FOUND
    );
  }

  const updated =
    await repository.updateRequest(id, {
      status:
        REQUEST_STATUS.ACCEPTED,

      matchedUser:
        matchedUserId,
    });

  // Notify original request owner
  await sendNotificationToUser(
    request.user,
    "Seat Exchange Accepted",
    "Your seat exchange request has been accepted successfully."
  );

  return {
    success: true,
    message:
      MESSAGE.REQUEST_ACCEPTED,
    data: updated,
  };
};

// =====================================================
// REJECT SEAT EXCHANGE REQUEST
// =====================================================

const rejectSeatExchange = async (
  id
) => {
  const request =
    await repository.getRequestById(id);

  if (!request) {
    throw new Error(
      MESSAGE.REQUEST_NOT_FOUND
    );
  }

  const updated =
    await repository.updateRequest(id, {
      status:
        REQUEST_STATUS.REJECTED,
    });

  // Notify original request owner
  await sendNotificationToUser(
    request.user,
    "Seat Exchange Rejected",
    "Your seat exchange request has been rejected."
  );

  return {
    success: true,
    message:
      MESSAGE.REQUEST_REJECTED,
    data: updated,
  };
};

// =====================================================
// CANCEL SEAT EXCHANGE REQUEST
// =====================================================

const cancelSeatExchange = async (
  id
) => {
  const request =
    await repository.getRequestById(id);

  if (!request) {
    throw new Error(
      MESSAGE.REQUEST_NOT_FOUND
    );
  }

  const updated =
    await repository.updateRequest(id, {
      status:
        REQUEST_STATUS.CANCELLED,
    });

  // Notify matched user if available
  if (request.matchedUser) {
    await sendNotificationToUser(
      request.matchedUser,
      "Seat Exchange Cancelled",
      "A seat exchange request has been cancelled."
    );
  }

  return {
    success: true,
    message:
      MESSAGE.REQUEST_CANCELLED,
    data: updated,
  };
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createSeatExchangeRequest,
  getAllSeatExchangeRequests,
  getSeatExchangeRequestById,
  findMatchingPassengers,
  acceptSeatExchange,
  rejectSeatExchange,
  cancelSeatExchange,
};