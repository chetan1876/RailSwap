const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./firebase-service-account.json");

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

(async () => {
  try {
    const snap = await db.collection("users").limit(1).get();
    console.log("Firestore Working:", snap.size);
  } catch (err) {
    console.error("Firestore Test Error");
    console.error(err);
  }
})();

module.exports = { app, db };