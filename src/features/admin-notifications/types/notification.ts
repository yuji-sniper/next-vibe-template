export const NotificationStatus = {
  SCHEDULED: 100,
  PROCESSING: 200,
  COMPLETED: 300,
  CANCELLED: 400
} as const

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus]

export const AudienceType = {
  ALL: 1,
  SEGMENT: 2,
  SINGLE: 3
} as const

export type AudienceType = (typeof AudienceType)[keyof typeof AudienceType]

export type NotificationListItem = {
  id: string
  title: string
  subject: string
  sendAt: string
  audienceType: number
  status: number
  createdAt: string
}

export type NotificationFilterStatus =
  | "all"
  | (typeof NotificationStatus)[keyof typeof NotificationStatus]
