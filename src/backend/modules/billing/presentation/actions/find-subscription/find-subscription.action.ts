"use server"

import type { SubscriptionStatus } from "@/backend/modules/billing/domain/subscription/subscription"
import type { ActionResponse } from "@/backend/modules/shared/presentation/actions/types/action-response"
import { handleFindSubscription } from "../../handlers/find-subscription/find-subscription.handler"

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
    return await handleFindSubscription()
  }
