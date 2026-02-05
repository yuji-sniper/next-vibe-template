import type { AudienceType } from "@/backend/modules/notification/internal/domain/notification/notification"

export interface UpdateNotificationUseCasePortInput {
  id: string
  title?: string
  subject?: string
  bodyText?: string
  bodyHtml?: string | null
  sendAt?: Date
  audienceType?: AudienceType
  audiencePayload?: Record<string, unknown>
}

export interface UpdateNotificationUseCasePortOutput {
  notification: {
    id: string
    title: string
    subject: string
    sendAt: Date
    audienceType: number
    status: number
  }
}

export interface UpdateNotificationUseCasePort {
  handle(
    input: UpdateNotificationUseCasePortInput
  ): Promise<UpdateNotificationUseCasePortOutput>
}

export const UpdateNotificationUseCasePortToken = Symbol(
  "UpdateNotificationUseCasePort"
)
