/* =====================================================
              TRAIN DELAY TRACKER — SERVICE
===================================================== */

// ─────────────────────────────────────────────────
//  DEMO DATA BANK
// ─────────────────────────────────────────────────

const DEMO_TRAINS = {
  "12951": {
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani Express",
    from: "Mumbai Central",
    to: "New Delhi",
    status: "delayed",
    delayMinutes: 42,
    currentLocation: "Near Mathura Junction",
    delayReason: "Signal congestion and heavy railway traffic",
    delayReasonOfficial: true,
    delayTrend: "increasing",
    stations: [
      {
        name: "Mumbai Central",
        scheduledDeparture: "17:00",
        actualDeparture: "17:00",
        delayMinutes: 0,
        status: "departed",
        isCurrent: false,
        delayReason: "No significant delay",
        expectedDepartureTime: "17:00",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Surat",
        scheduledArrival: "20:10",
        actualArrival: "20:25",
        delayMinutes: 15,
        status: "departed",
        isCurrent: false,
        delayReason: "Signal clearance delay",
        expectedDepartureTime: "20:25",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Vadodara",
        scheduledArrival: "22:05",
        actualArrival: "22:27",
        delayMinutes: 22,
        status: "departed",
        isCurrent: false,
        delayReason: "Heavy railway traffic",
        expectedDepartureTime: "22:27",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Ratlam",
        scheduledArrival: "01:20",
        actualArrival: "01:42",
        delayMinutes: 22,
        status: "departed",
        isCurrent: false,
        delayReason: "Late arrival of connecting train",
        expectedDepartureTime: "01:42",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Mathura Junction",
        scheduledArrival: "07:50",
        actualArrival: "08:32",
        delayMinutes: 42,
        status: "current",
        isCurrent: true,
        delayReason: "Signal congestion and heavy railway traffic",
        expectedDepartureTime: "09:05 AM",
        estimatedWaitMinutes: 33,
      },
      {
        name: "New Delhi",
        scheduledArrival: "08:30",
        actualArrival: "09:12",
        delayMinutes: 42,
        status: "upcoming",
        isCurrent: false,
        delayReason: "Delay accumulated from previous stations",
        expectedDepartureTime: "09:12 AM",
        estimatedWaitMinutes: 0,
      },
    ],
  },

  "12301": {
    trainNumber: "12301",
    trainName: "Howrah Rajdhani Express",
    from: "New Delhi",
    to: "Howrah",
    status: "delayed",
    delayMinutes: 28,
    currentLocation: "Near Gaya Junction",
    delayReason: "Preceding train clearance",
    delayReasonOfficial: true,
    delayTrend: "stable",
    stations: [
      {
        name: "New Delhi",
        scheduledDeparture: "16:55",
        actualDeparture: "16:55",
        delayMinutes: 0,
        status: "departed",
        isCurrent: false,
        delayReason: "No significant delay",
        expectedDepartureTime: "16:55",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Kanpur Central",
        scheduledArrival: "22:00",
        actualArrival: "22:10",
        delayMinutes: 10,
        status: "departed",
        isCurrent: false,
        delayReason: "Platform clearance delay",
        expectedDepartureTime: "22:10",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Allahabad Junction",
        scheduledArrival: "00:15",
        actualArrival: "00:33",
        delayMinutes: 18,
        status: "departed",
        isCurrent: false,
        delayReason: "Preceding train congestion",
        expectedDepartureTime: "00:33",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Mughal Sarai",
        scheduledArrival: "01:25",
        actualArrival: "01:53",
        delayMinutes: 28,
        status: "departed",
        isCurrent: false,
        delayReason: "Operational track change",
        expectedDepartureTime: "01:53",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Gaya Junction",
        scheduledArrival: "05:45",
        actualArrival: "06:13",
        delayMinutes: 28,
        status: "current",
        isCurrent: true,
        delayReason: "Preceding train clearance and signal hold",
        expectedDepartureTime: "06:35 AM",
        estimatedWaitMinutes: 22,
      },
      {
        name: "Howrah",
        scheduledArrival: "10:00",
        actualArrival: "10:28",
        delayMinutes: 28,
        status: "upcoming",
        isCurrent: false,
        delayReason: "Delay carried forward from previous stations",
        expectedDepartureTime: "10:28 AM",
        estimatedWaitMinutes: 0,
      },
    ],
  },

  "12560": {
    trainNumber: "12560",
    trainName: "Shiv Ganga Express",
    from: "Varanasi",
    to: "New Delhi",
    status: "on-time",
    delayMinutes: 0,
    currentLocation: "Near Allahabad Junction",
    delayReason: null,
    delayReasonOfficial: false,
    delayTrend: "stable",
    stations: [
      {
        name: "Varanasi",
        scheduledDeparture: "21:30",
        actualDeparture: "21:30",
        delayMinutes: 0,
        status: "departed",
        isCurrent: false,
        delayReason: "No significant delay",
        expectedDepartureTime: "21:30",
        estimatedWaitMinutes: 0,
      },
      {
        name: "Allahabad Junction",
        scheduledArrival: "23:55",
        actualArrival: "23:55",
        delayMinutes: 0,
        status: "current",
        isCurrent: true,
        delayReason: "No significant delay",
        expectedDepartureTime: "23:58 PM",
        estimatedWaitMinutes: 3,
      },
      {
        name: "Kanpur Central",
        scheduledArrival: "02:10",
        actualArrival: "02:10",
        delayMinutes: 0,
        status: "upcoming",
        isCurrent: false,
        delayReason: "No significant delay",
        expectedDepartureTime: "02:10",
        estimatedWaitMinutes: 0,
      },
      {
        name: "New Delhi",
        scheduledArrival: "06:15",
        actualArrival: "06:15",
        delayMinutes: 0,
        status: "upcoming",
        isCurrent: false,
        delayReason: "No significant delay",
        expectedDepartureTime: "06:15",
        estimatedWaitMinutes: 0,
      },
    ],
  },
};

// ─────────────────────────────────────────────────
//  DEMO PNR MAP  →  train number
// ─────────────────────────────────────────────────

const DEMO_PNR_MAP = {
  "1234567890": {
    trainNumber: "12951",
    passenger: "Rahul Kumar",
    journeyDate: "2026-08-20",
    coach: "A1",
    seat: "34",
    class: "2A",
  },
  "6504791510": {
    trainNumber: "12301",
    passenger: "Priya Sharma",
    journeyDate: "2026-08-21",
    coach: "B2",
    seat: "25",
    class: "3A",
  },
  "9876543210": {
    trainNumber: "12951",
    passenger: "Amit Verma",
    journeyDate: "2026-08-22",
    coach: "A2",
    seat: "12",
    class: "2A",
  },
};

// ─────────────────────────────────────────────────
//  AI EXPLANATION GENERATOR (deterministic fallback)
// ─────────────────────────────────────────────────

const generateAIExplanation = (trainData, pnrData = null) => {
  const {
    trainName,
    trainNumber,
    status,
    delayMinutes,
    currentLocation,
    delayReason,
    stations,
    delayTrend,
  } = trainData;

  if (status === "on-time") {
    return `${trainName} (Train No. ${trainNumber}) is currently running on schedule. All stations have been covered on time and the train is expected to arrive at its destination as planned. No delays have been reported on this route.`;
  }

  // Find where delay started
  const delayStartStation = stations.find((s) => s.delayMinutes > 0);
  const delayStartName = delayStartStation ? delayStartStation.name : "an intermediate station";

  // Find station with maximum delay increase
  let maxIncrease = 0;
  let maxIncreaseStation = null;
  for (let i = 1; i < stations.length; i++) {
    const increase = stations[i].delayMinutes - stations[i - 1].delayMinutes;
    if (increase > maxIncrease) {
      maxIncrease = increase;
      maxIncreaseStation = stations[i].name;
    }
  }

  const trendText =
    delayTrend === "increasing"
      ? "continuing to increase"
      : delayTrend === "recovering"
      ? "gradually recovering"
      : "holding steady";

  const reasonText = delayReason
    ? `The primary cause has been identified as ${delayReason.toLowerCase()}.`
    : "The official delay reason has not been reported by Indian Railways at this time.";

  const maxIncreaseText = maxIncreaseStation
    ? ` The most significant increase was recorded near ${maxIncreaseStation}, where the delay grew by ${maxIncrease} minutes.`
    : "";

  const pnrText = pnrData
    ? ` Passenger ${pnrData.passenger} travelling in Coach ${pnrData.coach}, Seat ${pnrData.seat} should expect arrival at the destination approximately ${delayMinutes} minutes later than the scheduled time.`
    : "";

  return `${trainName} (Train No. ${trainNumber}) is currently running ${delayMinutes} minutes late. The delay first appeared near ${delayStartName}.${maxIncreaseText} The train is presently ${trendText} in its delay near ${currentLocation}. ${reasonText}${pnrText} Passengers are advised to check for real-time updates on the Indian Railways app or NTES portal.`;
};

// ─────────────────────────────────────────────────
//  BUILD FULL RESPONSE OBJECT
// ─────────────────────────────────────────────────

const buildResponse = (trainData, pnrData = null, source = "demo") => {
  const now = new Date();
  const lastUpdated = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  // Dynamically extract current station
  const currentStationData = trainData.stations.find(
    (s) => s.isCurrent || s.status === "current"
  ) || trainData.stations[0];

  // Build delay trend array
  const delayTrendValues = trainData.stations.map((s) => s.delayMinutes);

  // Find where delay started
  const delayStartStation = trainData.stations.find((s) => s.delayMinutes > 0);

  let delayStartAnalysis = null;
  if (delayStartStation) {
    const nextStation = trainData.stations.find(
      (s, idx) =>
        idx > trainData.stations.indexOf(delayStartStation) && s.delayMinutes > delayStartStation.delayMinutes
    );

    delayStartAnalysis = {
      station: delayStartStation.name,
      delayAtStart: delayStartStation.delayMinutes,
      nextIncreaseStation: nextStation ? nextStation.name : null,
      nextIncreaseDelay: nextStation ? nextStation.delayMinutes : null,
      summary: nextStation
        ? `Significant delay started near ${delayStartStation.name}. The delay of ${delayStartStation.delayMinutes} minutes increased to ${nextStation.delayMinutes} minutes near ${nextStation.name}.`
        : `Delay of ${delayStartStation.delayMinutes} minutes started near ${delayStartStation.name}.`,
    };
  }

  const aiExplanation = generateAIExplanation(trainData, pnrData);

  return {
    success: true,
    source,
    data: {
      pnr: pnrData ? Object.keys(DEMO_PNR_MAP).find((k) => DEMO_PNR_MAP[k] === pnrData) || null : null,
      trainNumber: trainData.trainNumber,
      trainName: trainData.trainName,
      from: trainData.from,
      to: trainData.to,
      journeyDate: pnrData ? pnrData.journeyDate : null,
      passengerName: pnrData ? pnrData.passenger : null,
      coach: pnrData ? pnrData.coach : null,
      seat: pnrData ? pnrData.seat : null,
      class: pnrData ? pnrData.class : null,
      status: trainData.status,
      delayMinutes: trainData.delayMinutes,
      currentLocation: trainData.currentLocation,
      delayReason: trainData.delayReason,
      delayReasonOfficial: trainData.delayReasonOfficial,
      delayTrend: trainData.delayTrend,
      currentStation: currentStationData
        ? {
            name: currentStationData.name,
            scheduledArrival: currentStationData.scheduledArrival || currentStationData.scheduledDeparture,
            actualArrival: currentStationData.actualArrival || currentStationData.actualDeparture,
            delayMinutes: currentStationData.delayMinutes,
            delayReason: currentStationData.delayReason || trainData.delayReason || "Signal congestion",
            expectedDepartureTime: currentStationData.expectedDepartureTime || "Around 09:05 AM",
            estimatedWaitMinutes: currentStationData.estimatedWaitMinutes || 33,
          }
        : null,
      delayTrendValues,
      delayStartAnalysis,
      stations: trainData.stations,
      aiExplanation,
      lastUpdated,
    },
  };
};

// ─────────────────────────────────────────────────
//  MAIN SERVICE FUNCTIONS
// ─────────────────────────────────────────────────

/**
 * Check delay status by train number
 */
const checkByTrainNumber = async (trainNumber) => {
  try {
    // In production, call live railway API here and wrap in try/catch
    // For now, use demo data
    const trainData = DEMO_TRAINS[trainNumber];

    if (!trainData) {
      // Return generic demo data for unknown train numbers
      const genericTrain = {
        ...DEMO_TRAINS["12951"],
        trainNumber,
        trainName: `Express Train ${trainNumber}`,
      };
      return buildResponse(genericTrain, null, "demo");
    }

    return buildResponse(trainData, null, "demo");
  } catch (err) {
    // If anything fails, return a safe demo fallback
    const fallback = {
      ...DEMO_TRAINS["12951"],
      trainNumber,
    };
    return buildResponse(fallback, null, "demo");
  }
};

/**
 * Check delay status by PNR number
 */
const checkByPNR = async (pnr) => {
  try {
    // Look up the PNR in the demo map
    const pnrData = DEMO_PNR_MAP[pnr];

    if (!pnrData) {
      // Unknown PNR → return demo data with the entered PNR attached
      const fakePnrData = {
        trainNumber: "12951",
        passenger: "Passenger",
        journeyDate: new Date().toISOString().split("T")[0],
        coach: "A1",
        seat: "34",
        class: "2A",
      };
      const trainData = DEMO_TRAINS["12951"];
      const result = buildResponse(trainData, fakePnrData, "demo");
      result.data.pnr = pnr;
      return result;
    }

    const trainData = DEMO_TRAINS[pnrData.trainNumber] || DEMO_TRAINS["12951"];
    const result = buildResponse(trainData, pnrData, "demo");
    result.data.pnr = pnr;
    return result;
  } catch (err) {
    const fallbackPnr = {
      trainNumber: "12951",
      passenger: "Passenger",
      journeyDate: new Date().toISOString().split("T")[0],
      coach: "A1",
      seat: "34",
      class: "2A",
    };
    const result = buildResponse(DEMO_TRAINS["12951"], fallbackPnr, "demo");
    result.data.pnr = pnr;
    return result;
  }
};

module.exports = {
  checkByTrainNumber,
  checkByPNR,
};
