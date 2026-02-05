export interface FindNotificationByIdUseCasePortInput {
  id: string
}

export interface NotificationDetailDto {
  id: string
  title: string
  subject: string
  bodyText: string
  bodyHtml: string | null
  sendAt: Date
  audienceType: number
  audiencePayload: Record<string, unknown> | null
  status: number
  schedulerName: string | null
  createdAt: Date
  updatedAt: Date
}

export interface FindNotificationByIdUseCasePortOutput {
  notification: NotificationDetailDto
}

export interface FindNotificationByIdUseCasePort {
  handle(
    input: FindNotificationByIdUseCasePortInput
  ): Promise<FindNotificationByIdUseCasePortOutput>
}

export const FindNotificationByIdUseCasePortToken = Symbol(
  "FindNotificationByIdUseCasePort"
)
