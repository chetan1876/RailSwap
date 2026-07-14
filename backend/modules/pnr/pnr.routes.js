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