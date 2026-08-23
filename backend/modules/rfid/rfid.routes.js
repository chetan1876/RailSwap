const express = require("express");
const router = express.Router();
const rfidController = require("./rfid.controller");

// POST /api/rfid/register - Verify PNR & Generate RFID
router.post("/register", rfidController.registerRFID);

// GET /api/rfid/:rfidId - Retrieve RFID Details
router.get("/:rfidId", rfidController.getRFIDById);

module.exports = router;
