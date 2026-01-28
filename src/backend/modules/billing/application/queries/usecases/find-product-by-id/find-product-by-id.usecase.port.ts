export type FindProductByIdUseCaseInput = {
  productId: string
}

export type PriceDto = {
  id: string
  productId: string
  stripePriceId: string | null
  currency: string
  unitAmount: number
  recurringInterval: "month" | "year" | null
  recurringIntervalCount: number
  type: "one_time" | "recurring"
  active: boolean
  metadata: Record<string, string> | null
  displayName: string | null
  createdAt: Date
  updatedAt: Date
}

export type FindProductByIdUseCaseOutput = {
  product: {
    id: string
    stripeProductId: string | null
    name: string
    description: string | null
    active: boolean
    displayOrder: number
    features: string[] | null
    metadata: Record<string, string> | null
    createdAt: Date
    updatedAt: Date
    prices: PriceDto[]
  }
}

export interface FindProductByIdUseCasePort {
  handle(
    input: FindProductByIdUseCaseInput
  ): Promise<FindProductByIdUseCaseOutput>
}

export const FindProductByIdUseCasePortToken = Symbol(
  "FindProductByIdUseCasePort"
)
