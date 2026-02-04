export class NotificationNotFoundError extends Error {
  constructor(notificationId?: string) {
    super(
      notificationId
        ? `Notification not found: ${notificationId}`
        : "Notification not found"
    )
    this.name = "NotificationNotFoundError"
  }
}

export class NotificationCreateFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to create notification")
    this.name = "NotificationCreateFailedError"
  }
}

export class NotificationUpdateFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to update notification")
    this.name = "NotificationUpdateFailedError"
  }
}

export class NotificationCancelFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Failed to cancel notification")
    this.name = "NotificationCancelFailedError"
  }
}

export class NotificationAlreadyCancelledError extends Error {
  constructor(notificationId?: string) {
    super(
      notificationId
        ? `Notification already cancelled: ${notificationId}`
        : "Notification already cancelled"
    )
    this.name = "NotificationAlreadyCancelledError"
  }
}

export class NotificationAlreadyCompletedError extends Error {
  constructor(notificationId?: string) {
    super(
      notificationId
        ? `Notification already completed: ${notificationId}`
        : "Notification already completed"
    )
    this.name = "NotificationAlreadyCompletedError"
  }
}

export class NotificationNotScheduledError extends Error {
  constructor(notificationId?: string) {
    super(
      notificationId
        ? `Notification is not in scheduled status: ${notificationId}`
        : "Notification is not in scheduled status"
    )
    this.name = "NotificationNotScheduledError"
  }
}
