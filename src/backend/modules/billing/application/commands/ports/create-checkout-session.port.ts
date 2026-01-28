export const CHECKOUT_SESSION_MODE = {
  PAYMENT: "payment",
  SUBSCRIPTION: "subscription"
} as const

export type CheckoutSessionMode =
  (typeof CHECKOUT_SESSION_MODE)[keyof typeof CHECKOUT_SESSION_MODE]

export interface CreateCheckoutSessionPortInput {
  stripeCustomerId: string
  stripePriceId: string
  successUrl: string
  cancelUrl: string
  mode: CheckoutSessionMode
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
