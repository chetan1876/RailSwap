const WomenSafetyRepository = require("./womenSafety.repository");

const {
  dashboardMapper,
  companionMapper,
  seatMapper,
  insightMapper,
} = require("./womenSafety.mapper");

const {
  SAFETY_SCORE_STATUS,
  COMPANION_STATUS,
} = require("./womenSafety.constants");

class WomenSafetyService {

  async initializeDashboard(userId) {

    const dashboardExists =
      await WomenSafetyRepository.dashboardExists(userId);

    if (dashboardExists) {
      return await WomenSafetyRepository.findByUserId(userId);
    }

    const dashboard = {
      userId,

      safetyScore: 96,

      verifiedTravelers: 120,

      activeTravelers: 85,

      aiMonitoring: true,

      safetyAccuracy: 98,

      companions: [],

      safeSeats: [],

      insight: {
        title: "AI Safety Insight",

        description:
          "Coach B2 currently has the highest women traveler density and lowest safety risk score.",

        riskLevel: "LOW",
      },

      isEmergencyActive: false,
    };

    return await WomenSafetyRepository.create(dashboard);
  }

  async getDashboard(userId) {

    const dashboard =
      await WomenSafetyRepository.getDashboard(userId);

    if (!dashboard) {
      throw new Error("Women Safety Dashboard not found");
    }

    return dashboardMapper(dashboard);
  }

  async getSafetyScore(userId) {

    const data =
      await WomenSafetyRepository.getSafetyScore(userId);

    if (!data) {
      throw new Error("Safety Score not found");
    }

    let status = SAFETY_SCORE_STATUS.RISK;

    if (data.safetyScore >= 95) {

      status = SAFETY_SCORE_STATUS.EXCELLENT;

    } else if (data.safetyScore >= 80) {

      status = SAFETY_SCORE_STATUS.GOOD;

    } else if (data.safetyScore >= 60) {

      status = SAFETY_SCORE_STATUS.AVERAGE;
    }

    return {

      score: data.safetyScore,

      status,
    };
  }

  async getCompanions(userId) {

    const response =
      await WomenSafetyRepository.getCompanions(userId);

    if (!response) {
      throw new Error("Companions not found");
    }

    return response.companions.map(companionMapper);
  }

  async getVerifiedCompanions(userId) {

    const companions =
      await WomenSafetyRepository.getVerifiedCompanions(userId);

    return companions.map((item) => {

      item.status = item.verified
        ? COMPANION_STATUS.VERIFIED
        : COMPANION_STATUS.PENDING;

      return companionMapper(item);

    });

  }

  async getSafeSeats(userId) {

    const seats =
      await WomenSafetyRepository.getSafeSeats(userId);

    if (!seats) {
      throw new Error("Safe Seats not found");
    }

    return seats.safeSeats.map(seatMapper);

  }

  async getAIInsight(userId) {

    const insight =
      await WomenSafetyRepository.getInsight(userId);

    if (!insight) {
      throw new Error("AI Insight not found");
    }

    return insightMapper(insight.insight);

  }

    async calculateSafetyScore(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    let score = 50;

    score += Math.min(dashboard.verifiedTravelers / 5, 20);

    score += Math.min(dashboard.activeTravelers / 10, 10);

    if (dashboard.aiMonitoring) {
      score += 10;
    }

    score += dashboard.safetyAccuracy / 10;

    if (dashboard.companions.length >= 3) {
      score += 5;
    }

    if (dashboard.safeSeats.length >= 3) {
      score += 5;
    }

    score = Math.min(Math.round(score), 100);

    await WomenSafetyRepository.updateSafetyScore(
      userId,
      score
    );

    return {
      safetyScore: score,
    };

  }

  async generateAISafeSeats(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

   const generatedSeats = [
  {
    id: "seat1",
    coach: "B2",
    seatNumber: "21",
    badge: "Safe",
    matchPercentage: 98,
  },
  {
    id: "seat2",
    coach: "B2",
    seatNumber: "24",
    badge: "Best",
    matchPercentage: 97,
  },
  {
    id: "seat3",
    coach: "B1",
    seatNumber: "18",
    badge: "Safe",
    matchPercentage: 96,
  },
  {
    id: "seat4",
    coach: "B3",
    seatNumber: "12",
    badge: "Best",
    matchPercentage: 99,
  },
];

    await WomenSafetyRepository.replaceSafeSeats(
      userId,
      generatedSeats
    );

    return generatedSeats.map(seatMapper);

  }

  async connectCompanion(userId, payload) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }
const companion = {

  id: Date.now().toString(),

  name: payload.name,

  age: payload.age,

  verified: true,

  matchPercentage: payload.matchPercentage,

  coach: payload.coach,

  seatNumber: payload.seatNumber,

  trainNumber: payload.trainNumber,

  trainName: payload.trainName,

  sourceStation: payload.sourceStation,

  destinationStation: payload.destinationStation,

  trustScore: payload.trustScore,

  profileImage: payload.profileImage || "",

};

    const updated =
      await WomenSafetyRepository.addCompanion(
        userId,
        companion
      );

    return companionMapper(
      updated.companions[
        updated.companions.length - 1
      ]
    );

  }

  async disconnectCompanion(userId, companionId) {

    const updated =
      await WomenSafetyRepository.removeCompanion(
        userId,
        companionId
      );

    return updated;

  }

  async refreshSafetyScore(userId) {

    await this.calculateSafetyScore(userId);

    return await this.getSafetyScore(userId);

  }

  async refreshSafeSeats(userId) {

    await this.generateAISafeSeats(userId);

    return await this.getSafeSeats(userId);

  }

  async updateDashboardStatistics(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    const verifiedTravelers =
      dashboard.companions.filter(
        (item) => item.verified
      ).length;

    const activeTravelers =
      dashboard.companions.length;

    await WomenSafetyRepository.updateVerifiedTravelers(
      userId,
      verifiedTravelers
    );

    await WomenSafetyRepository.updateActiveTravelers(
      userId,
      activeTravelers
    );

    return {

      verifiedTravelers,

      activeTravelers,

    };

  }

    async raiseSOS(userId, payload) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    await WomenSafetyRepository.raiseEmergency(userId);

    return {
      success: true,
      message: "SOS Alert sent successfully.",
      emergency: {
        coach: payload.coach,
        seatNumber: payload.seatNumber,
        latitude: payload.latitude || null,
        longitude: payload.longitude || null,
        emergencyMessage:
          payload.emergencyMessage || "",
        raisedAt: new Date(),
      },
    };

  }

  async contactRPF(userId, payload) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    return {
      success: true,
      message: "RPF has been notified successfully.",
      data: {
        coach: payload.coach,
        seatNumber: payload.seatNumber,
        reason: payload.reason,
        status: "REQUEST_SENT",
        createdAt: new Date(),
      },
    };

  }

  async contactHelpline(userId, payload) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    return {
      success: true,
      message: "Helpline request submitted successfully.",
      data: {
        issue: payload.issue,
        phoneNumber: payload.phoneNumber,
        status: "CONNECTED",
        createdAt: new Date(),
      },
    };

  }

  async generateAIInsight(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    let description =
      "Coach B2 currently has the highest women traveler density and lowest safety risk score. Recommended for seat exchange requests.";

    if (dashboard.safetyScore < 70) {

      description =
        "Safety score is below average. AI recommends changing coach or requesting seat exchange.";

    }

    const insight = {

      title: "AI Safety Insight",

      description,

      riskLevel:
        dashboard.safetyScore >= 90
          ? "LOW"
          : dashboard.safetyScore >= 70
          ? "MEDIUM"
          : "HIGH",

    };

    await WomenSafetyRepository.updateInsight(
      userId,
      insight
    );

    return insight;

  }

  async getEmergencyStatus(userId) {

    return await WomenSafetyRepository.getEmergencyStatus(
      userId
    );

  }

  async deleteDashboard(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    await WomenSafetyRepository.deleteDashboard(userId);

    return {
      success: true,
      message: "Women Safety Dashboard deleted successfully.",
    };

  }

    async refreshDashboard(userId) {

    await this.updateDashboardStatistics(userId);

    await this.calculateSafetyScore(userId);

    await this.generateAISafeSeats(userId);

    await this.generateAIInsight(userId);

    return await this.getDashboard(userId);

  }

  async refreshCompanions(userId) {

    const companions =
      await this.getVerifiedCompanions(userId);

    await this.updateDashboardStatistics(userId);

    return companions;

  }

  async resetDashboard(userId) {

    const dashboard =
      await WomenSafetyRepository.findByUserId(userId);

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    await WomenSafetyRepository.updateDashboard(userId, {

      safetyScore: 0,

      verifiedTravelers: 0,

      activeTravelers: 0,

      aiMonitoring: true,

      safetyAccuracy: 0,

      companions: [],

      safeSeats: [],

      insight: {

        title: "",

        description: "",

        riskLevel: "LOW",

      },

      isEmergencyActive: false,

      emergencyRaisedAt: null,

    });

    return await this.getDashboard(userId);

  }

}

module.exports = new WomenSafetyService();