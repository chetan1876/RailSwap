const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("./serviceAccountKey.json");

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);
const messaging = getMessaging(app);

// Firestore Test
(async () => {
  try {
    const snap = await db.collection("users").limit(1).get();
    console.log("Firestore Working:", snap.size);
  } catch (err) {
    console.error("Firestore Test Error");
    console.error(err);
  }
})();

// Send Push Notification
const sendNotification = async (
  token,
  title,
  body,
  data = {}
) => {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };

    const response = await messaging.send(message);

    console.log("✅ Notification Sent:", response);

    return response;
  } catch (error) {
    console.error("❌ Notification Error:", error);
  }
};

console.log("🔥 Firebase Initialized Successfully");

module.exports = {
  app,
  db,
  messaging,
  sendNotification,
};