"use server"

import { resolveContainer } from "@/backend/bootstrap/container"
import type { SubscriptionStatus } from "@/backend/modules/billing/domain/subscription/subscription"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { withRequestContext } from "@/backend/modules/shared/presentation/middleware/with-request-context"
import type { FindSubscriptionHandler } from "../../handlers/find-subscription/find-subscription.handler"
import { FindSubscriptionHandlerToken } from "../../handlers/find-subscription/find-subscription.handler"

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
      }
    | undefined
}>

export const findSubscriptionAction =
  async (): Promise<FindSubscriptionActionResponse> => {
    return withRequestContext(async () => {
      const handler = await resolveContainer<FindSubscriptionHandler>(
        FindSubscriptionHandlerToken
      )
      return handler.handle()
    })
  }
