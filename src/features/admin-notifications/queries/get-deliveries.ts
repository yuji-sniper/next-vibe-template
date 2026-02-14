import { findDeliveriesAction } from "@/backend/modules/notification/internal/presentation/actions/find-deliveries/find-deliveries.action"
import { ServerError } from "@/utils/error/server-error"
import type {
  DeliveryListItem,
  DeliveryStatus,
  DeliverySummary
} from "../types/delivery"

export type GetDeliveriesQueryParams = {
  notificationId: string
  status?: DeliveryStatus
  limit?: number
  offset?: number
}

export type GetDeliveriesQueryResult = {
  deliveries: DeliveryListItem[]
  summary: DeliverySummary
}

export const getDeliveriesQuery = async (
  params: GetDeliveriesQueryParams
): Promise<GetDeliveriesQueryResult> => {
  const res = await findDeliveriesAction({
    notificationId: params.notificationId,
    status: params.status,
    limit: params.limit,
    offset: params.offset
  })

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  const deliveries: DeliveryListItem[] = res.data.deliveries.map((d) => ({
    id: d.id,
    userId: d.userId,
    email: d.email,
    status: d.status,
    attemptCount: d.attemptCount,
    lastError: d.lastError,
    sesMessageId: d.sesMessageId,
    sentAt: d.sentAt?.toString() ?? null,
    createdAt: d.createdAt.toString()
  }))

  return {
    deliveries,
    summary: res.data.summary
  }
}
