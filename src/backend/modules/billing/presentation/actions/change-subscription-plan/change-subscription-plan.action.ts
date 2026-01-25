"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleChangeSubscriptionPlan } from "../../handlers/change-subscription-plan/change-subscription-plan.handler"

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
  return await handleChangeSubscriptionPlan(request)
}
