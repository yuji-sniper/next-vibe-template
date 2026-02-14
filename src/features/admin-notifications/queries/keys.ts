export const adminNotificationsKey = ["admin-notifications"] as const

export const adminNotificationsWithFilterKey = (params: {
  status?: number
  page: number
}) => ["admin-notifications", params] as const

export const adminNotificationDetailKey = (notificationId: string) =>
  ["admin-notifications", "detail", notificationId] as const

export const adminDeliveriesKey = (notificationId: string) =>
  ["admin-notifications", "deliveries", notificationId] as const

export const adminDeliveriesWithFilterKey = (params: {
  notificationId: string
  status?: number
  page: number
}) => ["admin-notifications", "deliveries", params] as const
