export interface CreateStripeCustomerPortInput {
  userId: string
  email: string
}

export interface CreateStripeCustomerPortOutput {
  stripeCustomerId: string
}

export interface CreateStripeCustomerPort {
  handle(
    input: CreateStripeCustomerPortInput
  ): Promise<CreateStripeCustomerPortOutput>
}

export const CreateStripeCustomerPortToken = Symbol("CreateStripeCustomerPort")
