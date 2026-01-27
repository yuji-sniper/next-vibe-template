import { createSubscriptionCheckoutSessionAction } from "@/backend/modules/billing/presentation/actions/create-subscription-checkout-session/create-subscription-checkout-session.action"
import { ServerError } from "@/utils/error/server-error"

export type CreateSubscriptionCheckoutSessionInput = {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export type CreateSubscriptionCheckoutSessionResult = {
  sessionUrl: string
}

export const createSubscriptionCheckoutSessionMutation = async (
  input: CreateSubscriptionCheckoutSessionInput
): Promise<CreateSubscriptionCheckoutSessionResult> => {
  const res = await createSubscriptionCheckoutSessionAction(input)

  if (!res.ok) {
    throw new ServerError(
      res.error.code,
      res.error.status,
      res.error.message,
      res.error.details
    )
  }

  return { sessionUrl: res.data.sessionUrl }
}
