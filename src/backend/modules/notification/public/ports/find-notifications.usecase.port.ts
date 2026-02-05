import type { NotificationStatus } from "@/backend/modules/notification/internal/domain/notification/notification"

export interface FindNotificationsUseCasePortInput {
  status?: NotificationStatus
  limit?: number
  offset?: number
}

export interface NotificationListItemDto {
  id: string
  title: string
  subject: string
  sendAt: Date
  audienceType: number
  status: number
  createdAt: Date
}

export interface FindNotificationsUseCasePortOutput {
  notifications: NotificationListItemDto[]
  total: number
}

export interface FindNotificationsUseCasePort {
  handle(
    input: FindNotificationsUseCasePortInput
  ): Promise<FindNotificationsUseCasePortOutput>
}

export const FindNotificationsUseCasePortToken = Symbol(
  "FindNotificationsUseCasePort"
)
