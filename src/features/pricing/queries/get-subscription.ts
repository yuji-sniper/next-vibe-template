import { findSubscriptionAction } from "@/backend/modules/billing/internal/presentation/actions/find-subscription/find-subscription.action"
import { ServerError } from "@/utils/error/server-error"
import type { Subscription } from "../types/subscription"

export type GetSubscriptionQueryResult = {
  subscription: Subscription | undefined
}

export const getSubscriptionQuery = async (
  includeProduct?: boolean
): Promise<GetSubscriptionQueryResult> => {
  const res = await findSubscriptionAction(
    includeProduct ? { includeProduct } : undefined
  )

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return { subscription: res.data.subscription }
}
