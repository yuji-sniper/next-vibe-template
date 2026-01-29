import { findSubscriptionAction } from "@/backend/modules/billing/presentation/actions/find-subscription/find-subscription.action"
import { ServerError } from "@/utils/error/server-error"
import type { Subscription } from "../types/subscription"

export type GetSubscriptionQueryResult = {
  subscription: Subscription | undefined
}

export const getSubscriptionQuery =
  async (): Promise<GetSubscriptionQueryResult> => {
    const res = await findSubscriptionAction()

    if (!res.ok) {
      throw new ServerError(
        res.error.code,
        res.error.status,
        res.error.message,
        res.error.details
      )
    }

    if (!res.data.subscription) {
      return { subscription: undefined }
    }

    const subscription: Subscription = {
      id: res.data.subscription.id,
      customerId: res.data.subscription.customerId,
      stripeSubscriptionId: res.data.subscription.stripeSubscriptionId,
      stripePriceId: res.data.subscription.stripePriceId,
      status: res.data.subscription.status,
      currentPeriodStart: res.data.subscription.currentPeriodStart,
      currentPeriodEnd: res.data.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: res.data.subscription.cancelAtPeriodEnd,
      createdAt: res.data.subscription.createdAt,
      updatedAt: res.data.subscription.updatedAt
    }

    return { subscription }
  }
