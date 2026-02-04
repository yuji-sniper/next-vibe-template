export type FindPricesByProductIdUseCaseInput = {
  productId: string
  activeOnly?: boolean
}

export type FindPricesByProductIdUseCaseOutput = {
  prices: {
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
  }[]
}

export interface FindPricesByProductIdUseCasePort {
  handle(
    input: FindPricesByProductIdUseCaseInput
  ): Promise<FindPricesByProductIdUseCaseOutput>
}

export const FindPricesByProductIdUseCasePortToken = Symbol(
  "FindPricesByProductIdUseCasePort"
)
