const { db } = require("../../config/firebase");

// =====================================================
// SAVE FCM TOKEN
// =====================================================

const saveFCMToken = async (userId, fcmToken) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!fcmToken) {
    throw new Error("FCM Token is required");
  }

  await db.collection("users").doc(userId).set(
    {
      fcmToken: fcmToken,
      updatedAt: new Date(),
    },
    {
      merge: true,
    }
  );

  return {
    userId,
    fcmToken,
  };
};

// =====================================================
// GET USER FCM TOKEN
// =====================================================

const getUserFCMToken = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const userDoc = await db
    .collection("users")
    .doc(userId)
    .get();

  if (!userDoc.exists) {
    return null;
  }

  const userData = userDoc.data();

  return userData.fcmToken || null;
};

// =====================================================
// DELETE FCM TOKEN
// =====================================================

const deleteFCMToken = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  await db.collection("users").doc(userId).update({
    fcmToken: null,
    updatedAt: new Date(),
  });

  return {
    success: true,
    message: "FCM Token removed successfully",
  };
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  saveFCMToken,
  getUserFCMToken,
  deleteFCMToken,
};