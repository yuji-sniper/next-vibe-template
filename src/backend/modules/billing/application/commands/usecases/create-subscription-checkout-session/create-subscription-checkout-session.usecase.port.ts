export interface CreateSubscriptionCheckoutSessionUseCasePortInput {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface CreateSubscriptionCheckoutSessionUseCasePortOutput {
  sessionUrl: string
}

export interface CreateSubscriptionCheckoutSessionUseCasePort {
  handle(
    input: CreateSubscriptionCheckoutSessionUseCasePortInput
  ): Promise<CreateSubscriptionCheckoutSessionUseCasePortOutput>
}

export const CreateSubscriptionCheckoutSessionUseCasePortToken = Symbol(
  "CreateSubscriptionCheckoutSessionUseCasePort"
)
