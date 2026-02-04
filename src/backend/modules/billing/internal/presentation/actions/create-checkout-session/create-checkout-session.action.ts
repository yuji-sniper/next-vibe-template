"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { CreateCheckoutSessionHandler } from "../../handlers/create-checkout-session/create-checkout-session.handler"
import { CreateCheckoutSessionHandlerToken } from "../../handlers/create-checkout-session/create-checkout-session.handler"

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
  return withRequestContext(async () => {
    const handler = await resolveContainer<CreateCheckoutSessionHandler>(
      CreateCheckoutSessionHandlerToken
    )
    return handler.handle(request)
  })
}
