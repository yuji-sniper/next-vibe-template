"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type {
  DeliveryListItemDto,
  DeliverySummaryDto
} from "@/backend/modules/notification/public/ports/find-deliveries.usecase.port"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type {
  FindDeliveriesHandler,
  FindDeliveriesHandlerInput
} from "../../handlers/find-deliveries/find-deliveries.handler"
import { FindDeliveriesHandlerToken } from "../../handlers/find-deliveries/find-deliveries.handler"

export type FindDeliveriesActionRequest = FindDeliveriesHandlerInput

export type FindDeliveriesActionResponse = ActionResponse<{
  deliveries: DeliveryListItemDto[]
  summary: DeliverySummaryDto
}>

export const findDeliveriesAction = async (
  request: FindDeliveriesActionRequest
): Promise<FindDeliveriesActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<FindDeliveriesHandler>(
      FindDeliveriesHandlerToken
    )
    return handler.handle(request)
  })
}
