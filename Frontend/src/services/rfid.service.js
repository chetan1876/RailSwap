import api from "./api";

// Register PNR to generate/retrieve RFID identity
export const registerRFID = async (pnr) => {
  const response = await api.post("/rfid/register", { pnr });
  return response.data;
};

// Retrieve RFID Information by ID
export const getRFIDById = async (rfidId) => {
  const response = await api.get(`/rfid/${rfidId}`);
  return response.data;
};
