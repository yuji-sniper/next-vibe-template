"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleCancelSubscription } from "../../handlers/cancel-subscription/cancel-subscription.handler"

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
  return await handleCancelSubscription(request)
}
