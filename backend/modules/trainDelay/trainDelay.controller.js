const {
  checkByTrainNumber,
  checkByPNR,
} = require("./trainDelay.service");

/* =====================================================
      POST /api/train-delay/check
===================================================== */

const checkTrainDelayController = async (req, res) => {
  try {
    const { searchType, value } = req.body;

    // ── Validate Input ──────────────────────────────
    if (!searchType || !value) {
      return res.status(400).json({
        success: false,
        message: "searchType and value are required.",
      });
    }

    const trimmedValue = String(value).trim();

    if (!trimmedValue) {
      return res.status(400).json({
        success: false,
        message: "Search value cannot be empty.",
      });
    }

    // ── Route by Type ───────────────────────────────
    let result;

    if (searchType === "pnr") {
      if (trimmedValue.length !== 10 || !/^\d+$/.test(trimmedValue)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid 10-digit PNR number.",
        });
      }
      result = await checkByPNR(trimmedValue);
    } else if (searchType === "train") {
      if (trimmedValue.length < 4 || !/^\d+$/.test(trimmedValue)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid train number (at least 4 digits).",
        });
      }
      result = await checkByTrainNumber(trimmedValue);
    } else {
      return res.status(400).json({
        success: false,
        message: "searchType must be 'pnr' or 'train'.",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    // Never expose stack trace — return a safe fallback flag
    return res.status(200).json({
      success: true,
      source: "demo",
      fallbackReason: "An internal error occurred; showing demo data.",
      data: null,
    });
  }
};

module.exports = {
  checkTrainDelayController,
};
