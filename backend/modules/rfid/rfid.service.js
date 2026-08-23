const pnrService = require("../pnr/pnr.service");
const rfidRepository = require("./rfid.repository");

// Helper function to generate 8-character uppercase alphanumeric RFID ID
const generateRfidId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomStr = "";
  for (let i = 0; i < 8; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RFID-RS-${randomStr}`;
};

// Register PNR to RFID
const registerRFID = async (pnr, userId = null) => {
  const cleanPnr = String(pnr).trim();

  if (!cleanPnr) {
    return {
      success: false,
      statusCode: 400,
      message: "PNR number is required",
    };
  }

  // Basic format validation: PNR must be 10 digits
  if (!/^\d{10}$/.test(cleanPnr)) {
    return {
      success: false,
      statusCode: 400,
      message: "Invalid PNR number. PNR must be a 10-digit numeric value.",
    };
  }

  // 1. Check if RFID registration already exists for this PNR (Requirement 9)
  const existingRegistration = await rfidRepository.findByPnr(cleanPnr);
  if (existingRegistration) {
    return {
      success: true,
      isExisting: true,
      message: "RFID Registration already exists for this PNR.",
      data: existingRegistration,
    };
  }

  // 2. Retrieve journey details from existing PNR service or fallback demo data
  let journeyDetails = null;
  try {
    const pnrResult = await pnrService.verifyPNR(cleanPnr);
    if (pnrResult && pnrResult.success) {
      const passenger = pnrResult.passengers?.[0] || {};
      journeyDetails = {
        passengerName: passenger.name && passenger.name !== "Passenger 1" ? passenger.name : "Bittu Kumar",
        trainNumber: pnrResult.trainNumber || "12301",
        trainName: pnrResult.trainName || "Rajdhani Express",
        from: pnrResult.from || "New Delhi",
        to: pnrResult.to || "Patna Junction",
        journeyDate: pnrResult.journeyDate || "28-Jul-2026",
        coach: passenger.coach || "A1",
        seat: passenger.seat || "34",
        class: pnrResult.class || "3A",
      };
    }
  } catch (err) {
    console.warn("PNR service verify error, fallback to demo details:", err.message);
  }

  // Requirement 14: Demo / Mock Fallback if live PNR data is unavailable
  if (!journeyDetails) {
    journeyDetails = {
      passengerName: "Bittu Kumar",
      trainNumber: "12301",
      trainName: "Rajdhani Express",
      from: "New Delhi",
      to: "Patna Junction",
      journeyDate: "28-Jul-2026",
      coach: "A1",
      seat: "34",
      class: "3A",
    };
  }

  // 3. Generate unique RFID ID (Format: RFID-RS-XXXXXXXX)
  let rfidId = generateRfidId();
  let attempts = 0;
  while (await rfidRepository.findById(rfidId)) {
    rfidId = generateRfidId();
    attempts++;
    if (attempts > 5) break;
  }

  // 4. Save RFID registration
  const registrationPayload = {
    rfidId,
    pnr: cleanPnr,
    userId,
    ...journeyDetails,
    status: "ACTIVE",
  };

  const newRegistration = await rfidRepository.createRegistration(registrationPayload);

  return {
    success: true,
    isExisting: false,
    message: "RFID registered successfully",
    data: newRegistration,
  };
};

// Retrieve RFID Information by RFID ID
const getRFIDById = async (rfidId) => {
  const cleanId = String(rfidId).trim();

  if (!cleanId) {
    return {
      success: false,
      statusCode: 400,
      message: "RFID ID is required",
    };
  }

  const registration = await rfidRepository.findById(cleanId);

  if (!registration) {
    return {
      success: false,
      statusCode: 404,
      message: "RFID Registration not found",
    };
  }

  return {
    success: true,
    data: registration,
  };
};

module.exports = {
  registerRFID,
  getRFIDById,
};
