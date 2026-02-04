export interface CreateCheckoutSessionUseCasePortInput {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface CreateCheckoutSessionUseCasePortOutput {
  sessionUrl: string
}

export interface CreateCheckoutSessionUseCasePort {
  handle(
    input: CreateCheckoutSessionUseCasePortInput
  ): Promise<CreateCheckoutSessionUseCasePortOutput>
}

export const CreateCheckoutSessionUseCasePortToken = Symbol(
  "CreateCheckoutSessionUseCasePort"
)
