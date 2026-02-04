import { changeSubscriptionPlanAction } from "@/backend/modules/billing/internal/presentation/actions/change-subscription-plan/change-subscription-plan.action"
import { ServerError } from "@/utils/error/server-error"

export type ChangeSubscriptionPlanInput = {
  newPriceId: string
}

export type ChangeSubscriptionPlanResult = {
  subscriptionId: string
  stripePriceId: string
}

export const changeSubscriptionPlanMutation = async (
  input: ChangeSubscriptionPlanInput
): Promise<ChangeSubscriptionPlanResult> => {
  const res = await changeSubscriptionPlanAction(input)

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
    stripePriceId: res.data.stripePriceId
  }
}
