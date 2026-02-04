"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { FindActivePlansHandler } from "../../handlers/find-active-plans/find-active-plans.handler"
import { FindActivePlansHandlerToken } from "../../handlers/find-active-plans/find-active-plans.handler"

export type FindActivePlansActionInput = {
  priceType?: "one_time" | "recurring"
}

export type Plan = {
  product: {
    id: string
    name: string
    description: string | null
    features: string[] | null
    displayOrder: number
  }
  prices: {
    id: string
    stripePriceId: string
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    displayName: string | null
  }[]
}

export type FindActivePlansActionResponse = ActionResponse<{
  plans: Plan[]
}>

export const findActivePlansAction = async (
  input?: FindActivePlansActionInput
): Promise<FindActivePlansActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<FindActivePlansHandler>(
      FindActivePlansHandlerToken
    )
    return handler.handle(input)
  })
}
