export const DeliveryStatus = {
  PENDING: 100,
  SENDING: 200,
  RETRYING: 210,
  SENT: 300,
  FAILED: 400,
  BOUNCED: 410,
  COMPLAINED: 420,
  SUPPRESSED: 500,
  UNSUBSCRIBED: 510
} as const

export type DeliveryStatus =
  (typeof DeliveryStatus)[keyof typeof DeliveryStatus]

export type DeliveryListItem = {
  id: number
  userId: string
  email: string
  status: number
  attemptCount: number
  lastError: string | null
  sesMessageId: string | null
  sentAt: string | null
  createdAt: string
}

export type DeliverySummary = {
  total: number
  pending: number
  sending: number
  sent: number
  failed: number
  suppressed: number
}

export type DeliveryFilterStatus = "all" | DeliveryStatus
