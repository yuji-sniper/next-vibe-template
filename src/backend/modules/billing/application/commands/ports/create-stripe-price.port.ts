export type CreateStripePricePortInput = {
  productId: string // Stripe Product ID
  unitAmount: number
  currency: string
  recurring?: {
    interval: "month" | "year"
    intervalCount: number
  }
  metadata?: Record<string, string>
}

export type CreateStripePricePortOutput = {
  id: string
  productId: string
  unitAmount: number
  currency: string
  type: "one_time" | "recurring"
  recurringInterval: string | null
  recurringIntervalCount: number | null
  active: boolean
  metadata: Record<string, string>
}

export interface CreateStripePricePort {
  handle(
    input: CreateStripePricePortInput
  ): Promise<CreateStripePricePortOutput>
}

export const CreateStripePricePortToken = Symbol("CreateStripePricePort")
