export type CreateStripeProductPortInput = {
  name: string
  description?: string
  metadata?: Record<string, string>
}

export type CreateStripeProductPortOutput = {
  id: string
  name: string
  description: string | null
  active: boolean
  metadata: Record<string, string>
}

export interface CreateStripeProductPort {
  handle(
    input: CreateStripeProductPortInput
  ): Promise<CreateStripeProductPortOutput>
}

export const CreateStripeProductPortToken = Symbol("CreateStripeProductPort")
