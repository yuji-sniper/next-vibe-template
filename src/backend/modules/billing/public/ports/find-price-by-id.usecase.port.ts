export type FindPriceByIdUseCaseInput = {
  priceId: string
}

export type FindPriceByIdUseCaseOutput = {
  price: {
    id: string
    productId: string
    stripePriceId: string | null
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    recurringIntervalCount: number
    displayName: string | null
    active: boolean
    metadata: Record<string, string> | null
    createdAt: Date
    updatedAt: Date
  }
}

export interface FindPriceByIdUseCasePort {
  handle(input: FindPriceByIdUseCaseInput): Promise<FindPriceByIdUseCaseOutput>
}

export const FindPriceByIdUseCasePortToken = Symbol("FindPriceByIdUseCasePort")
