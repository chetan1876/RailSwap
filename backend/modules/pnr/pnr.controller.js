const {
  verifyPNR,
  getPNRHistory,
} = require("./pnr.service");

// Verify PNR
const verifyPNRController = async (req, res) => {
  try {
    const { pnr } = req.body;

    const result = await verifyPNR(pnr);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get PNR History
const getPNRHistoryController = async (req, res) => {
  try {
    const history = await getPNRHistory();

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  verifyPNRController,
  getPNRHistoryController,
};