const notificationService = require("./notification.service.js");
const {
  saveFCMToken,
  getUserFCMToken,
  deleteFCMToken,
} = require("./notification.service");

// =====================================================
// SAVE FCM TOKEN
// =====================================================

const saveFCMTokenController = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        message: "userId and token are required",
      });
    }

    const data = await saveFCMToken(
      userId,
      token
    );

    return res.status(200).json({
      success: true,
      message: "FCM token saved successfully",
      data,
    });
  } catch (error) {
    console.error(
      "Save FCM Token Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to save FCM token",
    });
  }
};

// =====================================================
// GET FCM TOKEN
// =====================================================

const getUserFCMTokenController = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const data =
      await getUserFCMToken(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Get FCM Token Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get FCM token",
    });
  }
};

// =====================================================
// DELETE FCM TOKEN
// =====================================================

const deleteFCMTokenController = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const data =
      await deleteFCMToken(userId);

    return res.status(200).json({
      success: true,
      message:
        "FCM token deleted successfully",
      data,
    });
  } catch (error) {
    console.error(
      "Delete FCM Token Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete FCM token",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  saveFCMToken:
    saveFCMTokenController,

  getUserFCMToken:
    getUserFCMTokenController,

  deleteFCMToken:
    deleteFCMTokenController,
};