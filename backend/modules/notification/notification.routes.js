const express = require("express");

const router = express.Router();

const notificationController = require("./notification.controller");

// =====================================================
// SAVE FCM TOKEN
// =====================================================

router.post(
  "/save-token",
  notificationController.saveFCMToken
);

// =====================================================
// GET USER FCM TOKEN
// =====================================================

router.get(
  "/token/:userId",
  notificationController.getUserFCMToken
);

// =====================================================
// DELETE FCM TOKEN
// =====================================================

router.delete(
  "/token/:userId",
  notificationController.deleteFCMToken
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;