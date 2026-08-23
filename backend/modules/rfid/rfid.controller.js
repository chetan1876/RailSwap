const rfidService = require("./rfid.service");

// POST /api/rfid/register
const registerRFID = async (req, res, next) => {
  try {
    const { pnr } = req.body;
    const userId = req.user?.id || req.user?.uid || null;

    if (!pnr) {
      return res.status(400).json({
        success: false,
        message: "PNR number is required",
      });
    }

    const result = await rfidService.registerRFID(pnr, userId);

    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error registering RFID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error registering RFID. Please try again later.",
    });
  }
};

// GET /api/rfid/:rfidId
const getRFIDById = async (req, res, next) => {
  try {
    const { rfidId } = req.params;

    if (!rfidId) {
      return res.status(400).json({
        success: false,
        message: "RFID ID is required",
      });
    }

    const result = await rfidService.getRFIDById(rfidId);

    if (!result.success) {
      return res.status(result.statusCode || 404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving RFID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving RFID information.",
    });
  }
};

module.exports = {
  registerRFID,
  getRFIDById,
};
