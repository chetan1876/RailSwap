const mongoose = require("mongoose");
const WomenSafety = require("./womenSafety.model");



class WomenSafetyRepository {

  async findByUserId(userId) {
    return await WomenSafety.findOne({ userId });
  }

  async create(data) {
    return await WomenSafety.create(data);
  }

  async getDashboard(userId) {
    return await WomenSafety.findOne({ userId })
      .select(
        "safetyScore verifiedTravelers activeTravelers aiMonitoring safetyAccuracy companions safeSeats insight isEmergencyActive emergencyRaisedAt"
      )
      .lean();
  }

  async getSafetyScore(userId) {
    return await WomenSafety.findOne(
      { userId },
      {
        safetyScore: 1,
        _id: 0,
      }
    ).lean();
  }

  async getSafeSeats(userId) {
    return await WomenSafety.findOne(
      { userId },
      {
        safeSeats: 1,
        _id: 0,
      }
    ).lean();
  }

  async getCompanions(userId) {
    return await WomenSafety.findOne(
      { userId },
      {
        companions: 1,
        _id: 0,
      }
    ).lean();
  }

  async getVerifiedCompanions(userId) {
    return await WomenSafety.aggregate([
      {
      $match: {
           userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: "$companions",
      },
      {
        $match: {
          "companions.verified": true,
        },
      },
      {
        $replaceRoot: {
          newRoot: "$companions",
        },
      },
      {
        $sort: {
          matchPercentage: -1,
        },
      },
    ]);
  }

  async getInsight(userId) {
    return await WomenSafety.findOne(
      { userId },
      {
        insight: 1,
        _id: 0,
      }
    ).lean();
  }

  async updateSafetyScore(userId, safetyScore) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          safetyScore,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateVerifiedTravelers(userId, verifiedTravelers) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          verifiedTravelers,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateActiveTravelers(userId, activeTravelers) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          activeTravelers,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateMonitoring(userId, aiMonitoring) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          aiMonitoring,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateSafetyAccuracy(userId, safetyAccuracy) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          safetyAccuracy,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateInsight(userId, insight) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          insight,
        },
      },
      {
        new: true,
      }
    );
  }

  async raiseEmergency(userId) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          isEmergencyActive: true,
          emergencyRaisedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );
  }

  async clearEmergency(userId) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          isEmergencyActive: false,
        },
      },
      {
        new: true,
      }
    );
  }

  async getEmergencyStatus(userId) {
    return await WomenSafety.findOne(
      { userId },
      {
        isEmergencyActive: 1,
        emergencyRaisedAt: 1,
        _id: 0,
      }
    ).lean();
  }

  async dashboardExists(userId) {
    return await WomenSafety.exists({ userId });
  }

  async deleteDashboard(userId) {
    return await WomenSafety.deleteOne({ userId });
  }

  async updateDashboard(userId, payload) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: payload,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

    async addCompanion(userId, companion) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $push: {
          companions: companion,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateCompanion(userId, companionId, payload) {
    return await WomenSafety.findOneAndUpdate(
      {
        userId,
        "companions._id": companionId,
      },
      {
        $set: {
          "companions.$": payload,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async removeCompanion(userId, companionId) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $pull: {
          companions: {
            _id: companionId,
          },
        },
      },
      {
        new: true,
      }
    );
  }

  async addSafeSeat(userId, seat) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $push: {
          safeSeats: seat,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateSafeSeat(userId, seatId, payload) {
    return await WomenSafety.findOneAndUpdate(
      {
        userId,
        "safeSeats._id": seatId,
      },
      {
        $set: {
          "safeSeats.$": payload,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async removeSafeSeat(userId, seatId) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $pull: {
          safeSeats: {
            _id: seatId,
          },
        },
      },
      {
        new: true,
      }
    );
  }

  async getTopCompanions(userId, limit = 5) {
    return await WomenSafety.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: "$companions",
      },
      {
        $sort: {
          "companions.matchPercentage": -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $replaceRoot: {
          newRoot: "$companions",
        },
      },
    ]);
  }

  async getStatistics(userId) {
    return await WomenSafety.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          safetyScore: 1,
          verifiedTravelers: 1,
          activeTravelers: 1,
          safetyAccuracy: 1,
          companionCount: {
            $size: "$companions",
          },
          safeSeatCount: {
            $size: "$safeSeats",
          },
        },
      },
    ]);
  }

  async searchCompanion(userId, keyword) {
    return await WomenSafety.findOne(
      {
        userId,
        "companions.name": {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        companions: 1,
      }
    ).lean();
  }

  async replaceSafeSeats(userId, seats) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          safeSeats: seats,
        },
      },
      {
        new: true,
      }
    );
  }

  async replaceCompanions(userId, companions) {
    return await WomenSafety.findOneAndUpdate(
      { userId },
      {
        $set: {
          companions,
        },
      },
      {
        new: true,
      }
    );
  }

}

module.exports = new WomenSafetyRepository();
     