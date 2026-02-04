import { createCheckoutSessionAction } from "@/backend/modules/billing/internal/presentation/actions/create-checkout-session/create-checkout-session.action"
import { ServerError } from "@/utils/error/server-error"

export type CreateCheckoutSessionInput = {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export type CreateCheckoutSessionResult = {
  sessionUrl: string
}

export const createCheckoutSessionMutation = async (
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> => {
  const res = await createCheckoutSessionAction(input)

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
