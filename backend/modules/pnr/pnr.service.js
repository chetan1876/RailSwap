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
