const NotificationRepository = require("./notification.repository");

const {
  notificationMapper,
  notificationListMapper,
  notificationCountMapper,
  notificationResponseMapper,
} = require("./notification.mapper");

const {
  NOTIFICATION_TYPE,
  PRIORITY,
  SOURCE_MODULE,
} = require("./notification.constants");

class NotificationService {

  /*
  ========================================
  INITIALIZE NOTIFICATIONS
  ========================================
  */

  async initializeNotifications(userId) {

    const notifications =
      await NotificationRepository.findByUserId(
        userId
      );

    return notificationListMapper(
      notifications
    );

  }

  /*
  ========================================
  CREATE NOTIFICATION
  ========================================
  */

  async createNotification(payload) {

    const notification =
      await NotificationRepository.create({

        userId:
          payload.userId,

        title:
          payload.title,

        message:
          payload.message,

        type:
          payload.type,

        priority:
          payload.priority,

        sourceModule:
          payload.sourceModule,

      });

    return notificationMapper(
      notification
    );

  }

  /*
  ========================================
  GET NOTIFICATION
  ========================================
  */

  async getNotification(notificationId) {

    const notification =
      await NotificationRepository.findById(
        notificationId
      );

    if (!notification) {

      throw new Error(
        "Notification not found."
      );

    }

    return notificationMapper(
      notification
    );

  }

  /*
  ========================================
  GET ALL NOTIFICATIONS
  ========================================
  */

  async getAllNotifications(userId) {

    const notifications =
      await NotificationRepository.getAll(
        userId
      );

    return notificationListMapper(
      notifications
    );

  }

  /*
  ========================================
  GET UNREAD NOTIFICATIONS
  ========================================
  */

  async getUnreadNotifications(userId) {

    const notifications =
      await NotificationRepository.getUnread(
        userId
      );

    return notificationListMapper(
      notifications
    );

  }

  /*
  ========================================
  GET NOTIFICATION COUNT
  ========================================
  */

  async getNotificationCount(userId) {

    const count =
      await NotificationRepository.getCount(
        userId
      );

    return notificationCountMapper(
      count
    );

  }
  
    /*
  ========================================
  MARK NOTIFICATION AS READ
  ========================================
  */

  async markAsRead(notificationId) {

    const notification =
      await NotificationRepository.markAsRead(
        notificationId
      );

    if (!notification) {

      throw new Error(
        "Notification not found."
      );

    }

    return notificationMapper(
      notification
    );

  }

  /*
  ========================================
  MARK ALL NOTIFICATIONS AS READ
  ========================================
  */

  async markAllAsRead(userId) {

    const notifications =
      await NotificationRepository.markAllAsRead(
        userId
      );

    return notificationListMapper(
      notifications
    );

  }

  /*
  ========================================
  DELETE NOTIFICATION
  ========================================
  */

  async deleteNotification(notificationId) {

    const deleted =
      await NotificationRepository.delete(
        notificationId
      );

    if (!deleted) {

      throw new Error(
        "Notification not found."
      );

    }

    return notificationResponseMapper({

      success: true,

      message:
        "Notification deleted successfully.",

    });

  }

  /*
  ========================================
  DELETE ALL NOTIFICATIONS
  ========================================
  */

  async deleteAllNotifications(userId) {

    await NotificationRepository.deleteAll(
      userId
    );

    return notificationResponseMapper({

      success: true,

      message:
        "All notifications deleted successfully.",

    });

  }
    /*
  ========================================
  SEND SYSTEM NOTIFICATION
  ========================================
  */

  async sendSystemNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.SYSTEM,

      priority:
        PRIORITY.NORMAL,

      sourceModule:
        SOURCE_MODULE.SYSTEM,

    });

  }

  /*
  ========================================
  SEND EMERGENCY NOTIFICATION
  ========================================
  */

  async sendEmergencyNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.EMERGENCY,

      priority:
        PRIORITY.HIGH,

      sourceModule:
        SOURCE_MODULE.EMERGENCY_MEDICAL,

    });

  }

  /*
  ========================================
  SEND MEDICAL NOTIFICATION
  ========================================
  */

  async sendMedicalNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.MEDICAL,

      priority:
        PRIORITY.HIGH,

      sourceModule:
        SOURCE_MODULE.EMERGENCY_MEDICAL,

    });

  }

  /*
  ========================================
  SEND SEAT EXCHANGE NOTIFICATION
  ========================================
  */

  async sendSeatExchangeNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.SEAT_EXCHANGE,

      priority:
        PRIORITY.NORMAL,

      sourceModule:
        SOURCE_MODULE.SEAT_EXCHANGE,

    });

  }

  /*
  ========================================
  SEND WOMEN SAFETY NOTIFICATION
  ========================================
  */

  async sendWomenSafetyNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.WOMEN_SAFETY,

      priority:
        PRIORITY.HIGH,

      sourceModule:
        SOURCE_MODULE.WOMEN_SAFETY,

    });

  }
    /*
  ========================================
  SEND LOST & FOUND NOTIFICATION
  ========================================
  */

  async sendLostFoundNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.LOST_FOUND,

      priority:
        PRIORITY.NORMAL,

      sourceModule:
        SOURCE_MODULE.LOST_FOUND,

    });

  }

  /*
  ========================================
  SEND COMPLAINT NOTIFICATION
  ========================================
  */

  async sendComplaintNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.COMPLAINT,

      priority:
        PRIORITY.NORMAL,

      sourceModule:
        SOURCE_MODULE.COMPLAINT,

    });

  }

  /*
  ========================================
  SEND JOURNEY COMPANION NOTIFICATION
  ========================================
  */

  async sendJourneyCompanionNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.JOURNEY_COMPANION,

      priority:
        PRIORITY.NORMAL,

      sourceModule:
        SOURCE_MODULE.JOURNEY_COMPANION,

    });

  }

  /*
  ========================================
  SEND PAYMENT NOTIFICATION
  ========================================
  */

  async sendPaymentNotification(
    userId,
    title,
    message
  ) {

    return await this.createNotification({

      userId,

      title,

      message,

      type:
        NOTIFICATION_TYPE.PAYMENT,

      priority:
        PRIORITY.NORMAL,

      sourceModule:
        SOURCE_MODULE.PAYMENT,

    });

  }

}

module.exports =
  new NotificationService();