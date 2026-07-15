const express = require("express");
const router = express.Router();

// Pure controller file ka path extension ke sath link karein
const {
    verifyPNRController,
    getPNRHistoryController
} = require("./pnr.controller.js"); 

// Verify PNR
router.post("/verify", verifyPNRController);

// Get All Verified PNR History
router.get("/history", getPNRHistoryController);

module.exports = router;