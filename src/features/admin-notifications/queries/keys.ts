export const adminNotificationsKey = ["admin-notifications"] as const

export const adminNotificationsWithFilterKey = (params: {
  status?: number
  page: number
}) => ["admin-notifications", params] as const
