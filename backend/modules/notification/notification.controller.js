const NotificationService = require("./notification.service");

class NotificationController {

  /*
  ========================================
  INITIALIZE NOTIFICATIONS
  ========================================
  */

  async initializeNotifications(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await NotificationService.initializeNotifications(
          userId
        );

      return res.status(200).json({

        success: true,

        message:
          "Notifications initialized successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  CREATE NOTIFICATION
  ========================================
  */

  async createNotification(req, res, next) {

    try {

      const response =
        await NotificationService.createNotification(
          req.body
        );

      return res.status(201).json({

        success: true,

        message:
          "Notification created successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  GET NOTIFICATION
  ========================================
  */

  async getNotification(req, res, next) {

    try {

      const {
        notificationId,
      } = req.params;

      const response =
        await NotificationService.getNotification(
          notificationId
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
  GET ALL NOTIFICATIONS
  ========================================
  */

  async getAllNotifications(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await NotificationService.getAllNotifications(
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
  GET UNREAD NOTIFICATIONS
  ========================================
  */

  async getUnreadNotifications(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await NotificationService.getUnreadNotifications(
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
  GET NOTIFICATION COUNT
  ========================================
  */

  async getNotificationCount(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await NotificationService.getNotificationCount(
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
  MARK NOTIFICATION AS READ
  ========================================
  */

  async markAsRead(req, res, next) {

    try {

      const {
        notificationId,
      } = req.params;

      const response =
        await NotificationService.markAsRead(
          notificationId
        );

      return res.status(200).json({

        success: true,

        message:
          "Notification marked as read successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  MARK ALL NOTIFICATIONS AS READ
  ========================================
  */

  async markAllAsRead(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await NotificationService.markAllAsRead(
          userId
        );

      return res.status(200).json({

        success: true,

        message:
          "All notifications marked as read successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  DELETE NOTIFICATION
  ========================================
  */

  async deleteNotification(req, res, next) {

    try {

      const {
        notificationId,
      } = req.params;

      const response =
        await NotificationService.deleteNotification(
          notificationId
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
  DELETE ALL NOTIFICATIONS
  ========================================
  */

  async deleteAllNotifications(req, res, next) {

    try {

      const { userId } = req.params;

      const response =
        await NotificationService.deleteAllNotifications(
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
  SEND SYSTEM NOTIFICATION
  ========================================
  */

  async sendSystemNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendSystemNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "System notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  SEND EMERGENCY NOTIFICATION
  ========================================
  */

  async sendEmergencyNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendEmergencyNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "Emergency notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  SEND MEDICAL NOTIFICATION
  ========================================
  */

  async sendMedicalNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendMedicalNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "Medical notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  SEND SEAT EXCHANGE NOTIFICATION
  ========================================
  */

  async sendSeatExchangeNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendSeatExchangeNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "Seat exchange notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  SEND WOMEN SAFETY NOTIFICATION
  ========================================
  */

  async sendWomenSafetyNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendWomenSafetyNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "Women Safety notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }
    /*
  ========================================
  SEND LOST & FOUND NOTIFICATION
  ========================================
  */

  async sendLostFoundNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendLostFoundNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "Lost & Found notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  SEND COMPLAINT NOTIFICATION
  ========================================
  */

  async sendComplaintNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendComplaintNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "Complaint notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  SEND JOURNEY COMPANION NOTIFICATION
  ========================================
  */

  async sendJourneyCompanionNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendJourneyCompanionNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "Journey Companion notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

  /*
  ========================================
  SEND PAYMENT NOTIFICATION
  ========================================
  */

  async sendPaymentNotification(req, res, next) {

    try {

      const {
        userId,
        title,
        message,
      } = req.body;

      const response =
        await NotificationService.sendPaymentNotification(

          userId,

          title,

          message

        );

      return res.status(201).json({

        success: true,

        message:
          "Payment notification sent successfully.",

        data: response,

      });

    } catch (error) {

      next(error);

    }

  }

}

module.exports =
  new NotificationController();