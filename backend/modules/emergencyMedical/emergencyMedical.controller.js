const EmergencyMedicalService = require("./emergencyMedical.service");

class EmergencyMedicalController {

  /*
  ========================================
  INITIALIZE DASHBOARD
  ========================================
  */

  async initializeDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.initializeDashboard(
          userId
        );

      return res.status(201).json({
        success: true,
        message: "Emergency Medical Dashboard initialized successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET DASHBOARD
  ========================================
  */

  async getDashboard(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getDashboard(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET RESPONSE TIME
  ========================================
  */

  async getResponseTime(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getResponseTime(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET DOCTORS
  ========================================
  */

  async getDoctors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getDoctors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET AVAILABLE DOCTORS
  ========================================
  */

  async getAvailableDoctors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getAvailableDoctors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET DONORS
  ========================================
  */

  async getDonors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getDonors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET AVAILABLE DONORS
  ========================================
  */

  async getAvailableDonors(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getAvailableDonors(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  GET AI INSIGHT
  ========================================
  */

  async getAIInsight(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.getAIInsight(
          userId
        );

      return res.status(200).json({
        success: true,
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  CONNECT DOCTOR
  ========================================
  */

  async connectDoctor(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.connectDoctor(
          userId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message: "Doctor connected successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  /*
  ========================================
  CONNECT DONOR
  ========================================
  */

  async connectDonor(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await EmergencyMedicalService.connectDonor(
          userId,
          req.body
        );

      return res.status(201).json({
        success: true,
        message: "Donor connected successfully.",
        data: response,
      });

    } catch (error) {
      next(error);
    }

  }

  // Continue with:
  // disconnectDoctor()
  // disconnectDonor()
  // raiseSOS()
  // contactDoctor()
  // contactHelpline()
  // refreshDashboard()
  // refreshResponseTime()
  // refreshDoctors()
  // refreshDonors()
  // getEmergencyStatus()
  // resetDashboard()
  // deleteDashboard()

}

module.exports = new EmergencyMedicalController();