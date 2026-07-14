const PNR = require("./pnr.model");

// Find PNR by Number
const findPNRByNumber = async (pnr) => {
  return await PNR.findOne({ pnr });
};

// Create New PNR
const createPNR = async (pnrData) => {
  return await PNR.create(pnrData);
};

// Get All PNRs
const getAllPNRs = async () => {
  return await PNR.find().sort({ createdAt: -1 });
};

// Delete PNR
const deletePNR = async (pnr) => {
  return await PNR.findOneAndDelete({ pnr });
};

module.exports = {
  findPNRByNumber,
  createPNR,
  getAllPNRs,
  deletePNR,
};