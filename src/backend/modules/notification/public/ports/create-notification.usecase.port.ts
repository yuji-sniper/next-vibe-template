import type { AudienceType } from "@/backend/modules/notification/internal/domain/notification/notification"

export interface CreateNotificationUseCasePortInput {
  title: string
  subject: string
  bodyText: string
  bodyHtml?: string
  sendAt: Date
  audienceType: AudienceType
  audiencePayload?: Record<string, unknown>
}

export interface CreateNotificationUseCasePortOutput {
  notification: {
    id: string
    title: string
    subject: string
    sendAt: Date
    audienceType: number
    status: number
  }
}

export interface CreateNotificationUseCasePort {
  handle(
    input: CreateNotificationUseCasePortInput
  ): Promise<CreateNotificationUseCasePortOutput>
}

export const CreateNotificationUseCasePortToken = Symbol(
  "CreateNotificationUseCasePort"
)
