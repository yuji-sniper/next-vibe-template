export type FindProductsUseCaseInput = {
  activeOnly?: boolean
  includePrices?: boolean
}

export type ProductWithPrices = {
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
  priceCount: number
  prices?: {
    id: string
    stripePriceId: string | null
    unitAmount: number
    currency: string
    type: "one_time" | "recurring"
    recurringInterval: string | null
    displayName: string | null
    active: boolean
  }[]
}

export type FindProductsUseCaseOutput = {
  products: ProductWithPrices[]
}

export interface FindProductsUseCasePort {
  handle(input: FindProductsUseCaseInput): Promise<FindProductsUseCaseOutput>
}

export const FindProductsUseCasePortToken = Symbol("FindProductsUseCasePort")
