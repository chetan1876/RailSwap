<<<<<<< Updated upstream
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
=======
const pnrService = require('./pnr.service'); // 👈 Yahan pnr.service hona chahiye, seatExchange nahi!
const pnrValidator = require('./pnr.validation');
const PnrDTO = require('./pnr.dto');
const PnrMapper = require('./pnr.mapper');
const { MESSAGES } = require('./pnr.constants');

class PnrController {
    async verifyPnr(req, res, next) {
        try {
            const pnrDto = PnrDTO.fromRequest(req);
            
            const validation = pnrValidator.validateVerifyRequest(pnrDto);
            if (!validation.isValid) {
                return res.status(400).json({ success: false, message: validation.message });
            }

            const userId = req.user ? req.user.id : null; 
            const rawPnrData = await pnrService.processPnrVerification(pnrDto.pnrNumber, userId);
            const formattedResponse = PnrMapper.toClientResponse(rawPnrData);

            return res.status(200).json({
                success: true,
                message: MESSAGES.FETCH_SUCCESS,
                data: formattedResponse
            });
        } catch (error) {
            next(error); 
        }
    }

    async getRecentPnrs(req, res, next) {
        try {
            const recentSearches = await pnrService.getLatestSearches();
            const formattedResponse = PnrMapper.toClientResponseList(recentSearches);
            
            return res.status(200).json({
                success: true,
                data: formattedResponse
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PnrController();
>>>>>>> Stashed changes
