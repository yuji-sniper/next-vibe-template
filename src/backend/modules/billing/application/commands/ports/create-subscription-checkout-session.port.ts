export interface CreateSubscriptionCheckoutSessionPortInput {
  stripeCustomerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface CreateSubscriptionCheckoutSessionPortOutput {
  sessionId: string
  sessionUrl: string
}

export interface CreateSubscriptionCheckoutSessionPort {
  handle(
    input: CreateSubscriptionCheckoutSessionPortInput
  ): Promise<CreateSubscriptionCheckoutSessionPortOutput>
}

export const CreateSubscriptionCheckoutSessionPortToken = Symbol(
  "CreateSubscriptionCheckoutSessionPort"
)
