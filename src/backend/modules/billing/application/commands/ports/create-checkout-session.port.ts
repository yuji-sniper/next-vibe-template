export interface CreateCheckoutSessionPortInput {
  stripeCustomerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface CreateCheckoutSessionPortOutput {
  sessionId: string
  sessionUrl: string
}

export interface CreateCheckoutSessionPort {
  handle(
    input: CreateCheckoutSessionPortInput
  ): Promise<CreateCheckoutSessionPortOutput>
}

export const CreateCheckoutSessionPortToken = Symbol(
  "CreateCheckoutSessionPort"
)
