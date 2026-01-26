export type UpdateStripeProductPortInput = {
  stripeProductId: string
  name?: string
  description?: string
  active?: boolean
  metadata?: Record<string, string>
}

export interface UpdateStripeProductPort {
  handle(input: UpdateStripeProductPortInput): Promise<void>
}

export const UpdateStripeProductPortToken = Symbol("UpdateStripeProductPort")
