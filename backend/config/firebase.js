const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./firebase-service-account.json");

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

console.log("🔥 Firebase Initialized Successfully");

module.exports = {
  app,
  db,
};
