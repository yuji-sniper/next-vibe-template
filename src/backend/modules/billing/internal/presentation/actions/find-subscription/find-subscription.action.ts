"use server"

import { resolveContainer } from "@/backend/bootstrap/di/container"
import type { SubscriptionStatus } from "@/backend/modules/billing/internal/domain/subscription/subscription"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { FindSubscriptionHandler } from "../../handlers/find-subscription/find-subscription.handler"
import { FindSubscriptionHandlerToken } from "../../handlers/find-subscription/find-subscription.handler"

export type FindSubscriptionActionRequest = {
  includeProduct?: boolean
}

export type FindSubscriptionActionResponse = ActionResponse<{
  subscription:
    | {
        id: string
        customerId: string
        stripeSubscriptionId: string
        stripePriceId: string
        status: SubscriptionStatus
        currentPeriodStart: string | null
        currentPeriodEnd: string | null
        cancelAtPeriodEnd: boolean
        createdAt: string
        updatedAt: string
        product?: {
          id: string
          name: string
          description: string | null
          features: string[] | null
          price: {
            id: string
            stripePriceId: string | null
            unitAmount: number
            currency: string
            type: "one_time" | "recurring"
            recurringInterval: string | null
            displayName: string | null
          }
        }
      }
    | undefined
}>

export const findSubscriptionAction = async (
  request?: FindSubscriptionActionRequest
): Promise<FindSubscriptionActionResponse> => {
  return withRequestContext(async () => {
    const handler = await resolveContainer<FindSubscriptionHandler>(
      FindSubscriptionHandlerToken
    )
    return handler.handle(request)
  })
}
