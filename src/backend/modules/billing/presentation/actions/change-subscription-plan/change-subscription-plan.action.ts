"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { ChangeSubscriptionPlanHandler } from "../../handlers/change-subscription-plan/change-subscription-plan.handler"
import { ChangeSubscriptionPlanHandlerToken } from "../../handlers/change-subscription-plan/change-subscription-plan.handler"

export type ChangeSubscriptionPlanActionRequest = {
  newPriceId: string
}

export type ChangeSubscriptionPlanActionResponse = ActionResponse<{
  subscriptionId: string
  stripePriceId: string
}>

export const changeSubscriptionPlanAction = async (
  request: ChangeSubscriptionPlanActionRequest
): Promise<ChangeSubscriptionPlanActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<ChangeSubscriptionPlanHandler>(
      ChangeSubscriptionPlanHandlerToken
    )
    return handler.handle(request)
  })
}
