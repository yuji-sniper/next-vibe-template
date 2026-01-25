"use server"

import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleCreateCheckoutSession } from "../../handlers/create-checkout-session/create-checkout-session.handler"

export type CreateCheckoutSessionActionRequest = {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export type CreateCheckoutSessionActionResponse = ActionResponse<{
  sessionUrl: string
}>

export const createCheckoutSessionAction = async (
  request: CreateCheckoutSessionActionRequest
): Promise<CreateCheckoutSessionActionResponse> => {
  return await handleCreateCheckoutSession(request)
}
