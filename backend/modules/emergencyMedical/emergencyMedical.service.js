const EmergencyMedicalRepository = require("./emergencyMedical.repository");

const {
  dashboardMapper,
  doctorMapper,
  donorMapper,
  insightMapper,
} = require("./emergencyMedical.mapper");

const {
  RESPONSE_STATUS,
  DOCTOR_STATUS,
} = require("./emergencyMedical.constants");

class EmergencyMedicalService {

  /*
  ========================================
  INITIALIZE DASHBOARD
  ========================================
  */

  async initializeDashboard(userId) {

    const dashboardExists =
      await EmergencyMedicalRepository.dashboardExists(
        userId
      );

    if (dashboardExists) {
      return await EmergencyMedicalRepository.findByUserId(
        userId
      );
    }

    const dashboard = {

      userId,

      responseTime: 5,

      doctorsNearby: 18,

      availableDoctors: 12,

      medicalVolunteers: 25,

      emergencySupport: 24,

      doctors: [],

      donors: [],

      insight: {

        title: "AI Medical Insight",

        description:
          "Medical assistance is available within your nearby coaches.",

        riskLevel: "LOW",

      },

      isEmergencyActive: false,

      emergencyRaisedAt: null,

      emergencyData: null,

    };

    return await EmergencyMedicalRepository.create(
      dashboard
    );

  }

  /*
  ========================================
  GET DASHBOARD
  ========================================
  */

  async getDashboard(userId) {

    const dashboard =
      await EmergencyMedicalRepository.getDashboard(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Emergency Medical Dashboard not found"
      );

    }

    return dashboardMapper(
      dashboard
    );

  }

  /*
  ========================================
  GET RESPONSE TIME
  ========================================
  */

  async getResponseTime(userId) {

    const response =
      await EmergencyMedicalRepository.getResponseTime(
        userId
      );

    if (!response) {

      throw new Error(
        "Response Time not found"
      );

    }

    let status =
      RESPONSE_STATUS.NORMAL;

    if (response.responseTime <= 5) {

      status =
        RESPONSE_STATUS.EXCELLENT;

    } else if (
      response.responseTime <= 10
    ) {

      status =
        RESPONSE_STATUS.GOOD;

    } else if (
      response.responseTime <= 20
    ) {

      status =
        RESPONSE_STATUS.AVERAGE;

    }

    return {

      responseTime:
        response.responseTime,

      status,

    };

  }

  /*
  ========================================
  GET DOCTORS
  ========================================
  */

  async getDoctors(userId) {

    const response =
      await EmergencyMedicalRepository.getDoctors(
        userId
      );

    if (!response) {

      throw new Error(
        "Doctors not found"
      );

    }

    return (response.doctors || [])
      .map(doctorMapper);

  }

  /*
  ========================================
  GET AVAILABLE DOCTORS
  ========================================
  */

  async getAvailableDoctors(userId) {

    const doctors =
      await EmergencyMedicalRepository.getAvailableDoctors(
        userId
      );

    return (doctors || []).map((doctor) => {

      doctor.status =
        doctor.available
          ? DOCTOR_STATUS.AVAILABLE
          : DOCTOR_STATUS.BUSY;

      return doctorMapper(
        doctor
      );

    });

  }

  /*
  ========================================
  GET DONORS
  ========================================
  */

  async getDonors(userId) {

    const response =
      await EmergencyMedicalRepository.getDonors(
        userId
      );

    if (!response) {

      throw new Error(
        "Blood Donors not found"
      );

    }

    return (response.donors || [])
      .map(donorMapper);

  }

  /*
  ========================================
  GET AVAILABLE DONORS
  ========================================
  */

  async getAvailableDonors(userId) {

    const donors =
      await EmergencyMedicalRepository.getAvailableDonors(
        userId
      );

    return (donors || [])
      .map(donorMapper);

  }
    /*
  ========================================
  GET AI INSIGHT
  ========================================
  */

  async getAIInsight(userId) {

    const insight =
      await EmergencyMedicalRepository.getInsight(
        userId
      );

    if (!insight) {

      throw new Error(
        "AI Insight not found"
      );

    }

    return insightMapper(
      insight.insight
    );

  }

  /*
  ========================================
  CONNECT DOCTOR
  ========================================
  */

  async connectDoctor(userId, payload) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    const doctor = {

      id: Date.now().toString(),

      name: payload.name,

      speciality: payload.speciality,

      hospital: payload.hospital,

      coach: payload.coach,

      seatNumber: payload.seatNumber,

      phone: payload.phone,

      experience: payload.experience || 0,

      available: true,

      profileImage:
        payload.profileImage || "",

    };

    const updated =
      await EmergencyMedicalRepository.addDoctor(
        userId,
        doctor
      );

    return doctorMapper(
      updated.doctors[
        updated.doctors.length - 1
      ]
    );

  }

  /*
  ========================================
  CONNECT DONOR
  ========================================
  */

  async connectDonor(userId, payload) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    const donor = {

      id: Date.now().toString(),

      name: payload.name,

      blood: payload.blood,

      coach: payload.coach,

      seatNumber: payload.seatNumber,

      phone: payload.phone,

      verified: true,

      profileImage:
        payload.profileImage || "",

    };

    const updated =
      await EmergencyMedicalRepository.addDonor(
        userId,
        donor
      );

    return donorMapper(
      updated.donors[
        updated.donors.length - 1
      ]
    );

  }

  /*
  ========================================
  DISCONNECT DOCTOR
  ========================================
  */

  async disconnectDoctor(userId, doctorId) {

    const updated =
      await EmergencyMedicalRepository.removeDoctor(
        userId,
        doctorId
      );

    if (!updated) {

      throw new Error(
        "Doctor not found"
      );

    }

    return {

      success: true,

      message:
        "Doctor disconnected successfully.",

    };

  }

  /*
  ========================================
  DISCONNECT DONOR
  ========================================
  */

  async disconnectDonor(userId, donorId) {

    const updated =
      await EmergencyMedicalRepository.removeDonor(
        userId,
        donorId
      );

    if (!updated) {

      throw new Error(
        "Donor not found"
      );

    }

    return {

      success: true,

      message:
        "Blood Donor disconnected successfully.",

    };

  }

  /*
  ========================================
  CALCULATE RESPONSE TIME
  ========================================
  */

  async calculateResponseTime(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    let responseTime = 20;

    responseTime -= Math.min(
      dashboard.availableDoctors || 0,
      10
    );

    responseTime -= Math.min(
      (dashboard.medicalVolunteers || 0) / 5,
      5
    );

    if (
      (dashboard.doctors || []).length >= 3
    ) {

      responseTime -= 3;

    }

    if (
      (dashboard.donors || []).length >= 2
    ) {

      responseTime -= 2;

    }

    if (responseTime < 2) {

      responseTime = 2;

    }

    await EmergencyMedicalRepository.updateResponseTime(
      userId,
      responseTime
    );

    return {

      responseTime,

    };

  }

  /*
  ========================================
  REFRESH RESPONSE TIME
  ========================================
  */

  async refreshResponseTime(userId) {

    await this.calculateResponseTime(
      userId
    );

    return await this.getResponseTime(
      userId
    );

  }
    /*
  ========================================
  GENERATE AI DOCTORS
  ========================================
  */

  async generateAIDoctors(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    const doctors = [

      {
        id: "doctor1",
        name: "Dr. Aman Singh",
        speciality: "General Physician",
        hospital: "Railway Medical Team",
        coach: "B2",
        seatNumber: "18",
        phone: "9999999999",
        experience: 8,
        available: true,
        profileImage: "",
      },

      {
        id: "doctor2",
        name: "Dr. Neha Sharma",
        speciality: "Cardiologist",
        hospital: "AIIMS",
        coach: "B3",
        seatNumber: "22",
        phone: "8888888888",
        experience: 10,
        available: true,
        profileImage: "",
      },

      {
        id: "doctor3",
        name: "Dr. Raj Kumar",
        speciality: "Orthopedic",
        hospital: "Apollo",
        coach: "A1",
        seatNumber: "11",
        phone: "7777777777",
        experience: 6,
        available: true,
        profileImage: "",
      },

    ];

    await EmergencyMedicalRepository.replaceDoctors(
      userId,
      doctors
    );

    return doctors.map(
      doctorMapper
    );

  }

  /*
  ========================================
  GENERATE AI DONORS
  ========================================
  */

  async generateAIDonors(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    const donors = [

      {
        id: "donor1",
        name: "Rahul Kumar",
        blood: "O+",
        coach: "B2",
        seatNumber: "35",
        phone: "9876543210",
        verified: true,
        profileImage: "",
      },

      {
        id: "donor2",
        name: "Amit Singh",
        blood: "A+",
        coach: "B3",
        seatNumber: "16",
        phone: "9876543211",
        verified: true,
        profileImage: "",
      },

      {
        id: "donor3",
        name: "Priya Sharma",
        blood: "B+",
        coach: "A1",
        seatNumber: "28",
        phone: "9876543212",
        verified: true,
        profileImage: "",
      },

    ];

    await EmergencyMedicalRepository.replaceDonors(
      userId,
      donors
    );

    return donors.map(
      donorMapper
    );

  }

  /*
  ========================================
  RAISE SOS
  ========================================
  */

  async raiseSOS(userId, payload) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    await EmergencyMedicalRepository.raiseEmergency(
      userId,
      payload
    );

    return {

      success: true,

      message:
        "Emergency SOS sent successfully.",

      emergency: {

        coach: payload.coach,

        seatNumber: payload.seatNumber,

        emergencyType: payload.emergencyType,

        patientName: payload.patientName,

        message:
          payload.message || "",

        latitude:
          payload.latitude || null,

        longitude:
          payload.longitude || null,

        raisedAt:
          new Date(),

      },

    };

  }

  /*
  ========================================
  CONTACT DOCTOR
  ========================================
  */

  async contactDoctor(userId, payload) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    return {

      success: true,

      message:
        "Doctor notified successfully.",

      data: {

        doctorId:
          payload.doctorId,

        patientName:
          payload.patientName,

        emergencyType:
          payload.emergencyType,

        status:
          "REQUEST_SENT",

        createdAt:
          new Date(),

      },

    };

  }

  /*
  ========================================
  CONTACT MEDICAL HELPLINE
  ========================================
  */

  async contactHelpline(userId, payload) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    return {

      success: true,

      message:
        "Medical Helpline Connected.",

      data: {

        issue:
          payload.issue,

        phoneNumber:
          payload.phoneNumber,

        status:
          "CONNECTED",

        createdAt:
          new Date(),

      },

    };

  }

  /*
  ========================================
  GENERATE AI INSIGHT
  ========================================
  */

  async generateAIInsight(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {
      throw new Error("Dashboard not found");
    }

    let description =
      "Medical team is available nearby. Response time is excellent.";

    if (dashboard.responseTime > 10) {

      description =
        "Response time is increasing. AI recommends contacting the nearest doctor immediately.";

    }

    const insight = {

      title:
        "AI Medical Insight",

      description,

      riskLevel:
        dashboard.responseTime <= 5
          ? "LOW"
          : dashboard.responseTime <= 10
          ? "MEDIUM"
          : "HIGH",

    };

    await EmergencyMedicalRepository.updateInsight(
      userId,
      insight
    );

    return insight;

  }
    /*
  ========================================
  REFRESH DASHBOARD
  ========================================
  */

  async refreshDashboard(userId) {

    await this.calculateResponseTime(
      userId
    );

    await this.generateAIDoctors(
      userId
    );

    await this.generateAIDonors(
      userId
    );

    await this.generateAIInsight(
      userId
    );

    return await this.getDashboard(
      userId
    );

  }

  /*
  ========================================
  GET EMERGENCY STATUS
  ========================================
  */

  async getEmergencyStatus(userId) {

    const status =
      await EmergencyMedicalRepository.getEmergencyStatus(
        userId
      );

    if (!status) {

      throw new Error(
        "Dashboard not found"
      );

    }

    return status;

  }

  /*
  ========================================
  REFRESH DOCTORS
  ========================================
  */

  async refreshDoctors(userId) {

    await this.generateAIDoctors(
      userId
    );

    return await this.getAvailableDoctors(
      userId
    );

  }

  /*
  ========================================
  REFRESH DONORS
  ========================================
  */

  async refreshDonors(userId) {

    await this.generateAIDonors(
      userId
    );

    return await this.getAvailableDonors(
      userId
    );

  }

  /*
  ========================================
  RESET DASHBOARD
  ========================================
  */

  async resetDashboard(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    await EmergencyMedicalRepository.updateDashboard(
      userId,
      {

        responseTime: 0,

        doctorsNearby: 0,

        availableDoctors: 0,

        medicalVolunteers: 0,

        emergencySupport: 24,

        doctors: [],

        donors: [],

        insight: {

          title: "",

          description: "",

          riskLevel: "LOW",

        },

        isEmergencyActive: false,

        emergencyRaisedAt: null,

        emergencyData: null,

      }
    );

    return await this.getDashboard(
      userId
    );

  }

  /*
  ========================================
  DELETE DASHBOARD
  ========================================
  */

  async deleteDashboard(userId) {

    const dashboard =
      await EmergencyMedicalRepository.findByUserId(
        userId
      );

    if (!dashboard) {

      throw new Error(
        "Dashboard not found"
      );

    }

    await EmergencyMedicalRepository.deleteDashboard(
      userId
    );

    return {

      success: true,

      message:
        "Emergency Medical Dashboard deleted successfully.",

    };

  }

}

module.exports =
  new EmergencyMedicalService();