<<<<<<< Updated upstream
const express = require("express");

const router = express.Router();

const {
  verifyPNRController,
  getPNRHistoryController,
} = require("./pnr.controller");

// Verify PNR
router.post("/verify", verifyPNRController);

// Get All Verified PNR History
router.get("/history", getPNRHistoryController);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const pnrController = require('./pnr.controller'); // 👈 Yeh sahi controller hona chahiye!

router.post('/verify', pnrController.verifyPnr);
router.get('/recent', pnrController.getRecentPnrs);

module.exports = router;
>>>>>>> Stashed changes
