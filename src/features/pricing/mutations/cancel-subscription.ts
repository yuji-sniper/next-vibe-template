import { cancelSubscriptionAction } from "@/backend/modules/billing/internal/presentation/actions/cancel-subscription/cancel-subscription.action"
import { ServerError } from "@/utils/error/server-error"

export type CancelSubscriptionInput = {
  cancelAtPeriodEnd?: boolean
}

export type CancelSubscriptionResult = {
  subscriptionId: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
}

export const cancelSubscriptionMutation = async (
  input?: CancelSubscriptionInput
): Promise<CancelSubscriptionResult> => {
  const res = await cancelSubscriptionAction(input)

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return {
    subscriptionId: res.data.subscriptionId,
    cancelAtPeriodEnd: res.data.cancelAtPeriodEnd,
    currentPeriodEnd: res.data.currentPeriodEnd
  }
}
