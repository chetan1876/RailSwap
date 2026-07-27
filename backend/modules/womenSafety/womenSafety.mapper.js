const {
  DashboardDTO,
  CompanionDTO,
  SeatDTO,
  InsightDTO,
} = require("./womenSafety.dto");

const dashboardMapper = (document) => {
  return new DashboardDTO({
    safetyScore: document.safetyScore,

    safetyStatus:
      document.safetyScore >= 95
        ? "Excellent Safety Zone"
        : document.safetyScore >= 80
        ? "Good Safety Zone"
        : document.safetyScore >= 60
        ? "Average Safety Zone"
        : "Risk Zone",

    verifiedTravelers: document.verifiedTravelers,

    activeTravelers: document.activeTravelers,

    aiMonitoring: document.aiMonitoring,

    safetyAccuracy: document.safetyAccuracy,

    safeSeats: document.safeSeats.map(seatMapper),

    companions: document.companions.map(companionMapper),

    aiInsight: insightMapper(document.insight),
  });
};

const companionMapper = (companion) => {
  return new CompanionDTO({
    id: companion.id,

    name: companion.name,

    age: companion.age,

    verified: companion.verified,

    match: `${companion.matchPercentage}%`,

    coach: companion.coach,

    seatNumber: companion.seatNumber,

    profileImage: companion.profileImage,

    trustScore: companion.trustScore,
  });
};

const seatMapper = (seat) => {
  return new SeatDTO({
    coach: seat.coach,

    seatNumber: seat.seatNumber,

    badge: seat.badge,

    match: `${seat.matchPercentage}%`,
  });
};

const insightMapper = (insight) => {
  if (!insight) return null;

  return new InsightDTO({
    title: insight.title,

    description: insight.description,

    riskLevel: insight.riskLevel,
  });
};

module.exports = {
  dashboardMapper,
  companionMapper,
  seatMapper,
  insightMapper,
};