<<<<<<< Updated upstream
const {
  findPNRByNumber,
  getAllPNRs,
} = require("./pnr.repository");

const { PNR_MESSAGES } = require("./pnr.constants");

// Verify PNR
const verifyPNR = async (pnr) => {
  const pnrData = await findPNRByNumber(pnr);

  if (!pnrData) {
    return {
      success: false,
      message: PNR_MESSAGES.NOT_FOUND,
    };
  }

  return {
    success: true,
    message: PNR_MESSAGES.VERIFIED,
    data: pnrData,
  };
};

// Get PNR History
const getPNRHistory = async () => {
  return await getAllPNRs();
};

module.exports = {
  verifyPNR,
  getPNRHistory,
};
=======
const pnrRepository = require('./pnr.repository'); // 👈 Yahan pnr.repository hona chahiye!
const { PNR_STATUS } = require('./pnr.constants');

class PnrService {
    async processPnrVerification(pnrNumber, userId) {
        const mockTrains = [
            { name: "Rajdhani Express", from: "New Delhi", to: "Patna", status: PNR_STATUS.CONFIRMED },
            { name: "Vande Bharat Express", from: "Lucknow", to: "Delhi", status: "WL 12" },
            { name: "Shatabdi Express", from: "Kanpur", to: "Delhi", status: "RAC 4" }
        ];

        const selectTrain = mockTrains[Math.floor(Math.random() * mockTrains.length)];

        const finalPnrData = {
            pnrNumber: pnrNumber,
            trainName: selectTrain.name,
            sourceStation: selectTrain.from,
            destinationStation: selectTrain.to,
            bookingStatus: selectTrain.status
        };

        await pnrRepository.logSearchHistory({
            pnrNumber,
            userId,
            ...finalPnrData
        });

        return finalPnrData;
    }

    async getLatestSearches() {
        return await pnrRepository.fetchRecentLogs(3);
    }
}

module.exports = new PnrService();
>>>>>>> Stashed changes
