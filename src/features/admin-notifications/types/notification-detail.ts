export type NotificationDetail = {
  id: string
  title: string
  subject: string
  bodyText: string
  bodyHtml: string | null
  sendAt: string
  audienceType: number
  audiencePayload: Record<string, unknown> | null
  status: number
  schedulerName: string | null
  createdAt: string
  updatedAt: string
}
