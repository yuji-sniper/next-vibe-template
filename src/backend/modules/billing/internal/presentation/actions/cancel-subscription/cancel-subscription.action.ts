"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { CancelSubscriptionHandler } from "../../handlers/cancel-subscription/cancel-subscription.handler"
import { CancelSubscriptionHandlerToken } from "../../handlers/cancel-subscription/cancel-subscription.handler"

export type CancelSubscriptionActionRequest = {
  cancelAtPeriodEnd?: boolean
}

export type CancelSubscriptionActionResponse = ActionResponse<{
  subscriptionId: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
}>

export const cancelSubscriptionAction = async (
  request?: CancelSubscriptionActionRequest
): Promise<CancelSubscriptionActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<CancelSubscriptionHandler>(
      CancelSubscriptionHandlerToken
    )
    return handler.handle(request)
  })
}
