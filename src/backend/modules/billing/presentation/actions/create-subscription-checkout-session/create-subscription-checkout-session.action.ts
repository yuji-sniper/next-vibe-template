"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleCreateSubscriptionCheckoutSession } from "../../handlers/create-subscription-checkout-session/create-subscription-checkout-session.handler"

export type CreateSubscriptionCheckoutSessionActionRequest = {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export type CreateSubscriptionCheckoutSessionActionResponse = ActionResponse<{
  sessionUrl: string
}>

export const createSubscriptionCheckoutSessionAction = async (
  request: CreateSubscriptionCheckoutSessionActionRequest
): Promise<CreateSubscriptionCheckoutSessionActionResponse> => {
  return await handleCreateSubscriptionCheckoutSession(request)
}
