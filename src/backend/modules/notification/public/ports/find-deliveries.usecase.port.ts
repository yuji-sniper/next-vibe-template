import type { DeliveryStatus } from "@/backend/modules/notification/internal/domain/delivery/delivery"

export interface FindDeliveriesUseCasePortInput {
  notificationId: string
  status?: DeliveryStatus
  limit?: number
  offset?: number
}

export interface DeliveryListItemDto {
  id: number
  userId: string
  email: string
  status: number
  attemptCount: number
  lastError: string | null
  sesMessageId: string | null
  sentAt: Date | null
  createdAt: Date
}

export interface DeliverySummaryDto {
  total: number
  pending: number
  sending: number
  sent: number
  failed: number
  suppressed: number
}

export interface FindDeliveriesUseCasePortOutput {
  deliveries: DeliveryListItemDto[]
  summary: DeliverySummaryDto
}

export interface FindDeliveriesUseCasePort {
  handle(
    input: FindDeliveriesUseCasePortInput
  ): Promise<FindDeliveriesUseCasePortOutput>
}

export const FindDeliveriesUseCasePortToken = Symbol(
  "FindDeliveriesUseCasePort"
)
