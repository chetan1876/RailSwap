const express = require("express");
const router = express.Router();

const {
  checkTrainDelayController,
} = require("./trainDelay.controller");

/* =====================================================
      POST /api/train-delay/check
===================================================== */
router.post("/check", checkTrainDelayController);

module.exports = router;
