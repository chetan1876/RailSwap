const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("./firebase-service-account.json");

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);
const messaging = getMessaging(app);

(async () => {
  try {
    const snap = await db.collection("users").limit(1).get();
    console.log("Firestore Working:", snap.size);
  } catch (err) {
    console.error("Firestore Test Error");
    console.error(err);
  }
})();

 HEAD
module.exports = {
  app,
  db,
  messaging,
};

module.exports = { app, db };
d1914c99768105f72d07e6bf7ef0d84f7b4b023d
