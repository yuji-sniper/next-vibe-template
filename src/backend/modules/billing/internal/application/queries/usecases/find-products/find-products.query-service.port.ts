export type FindProductsQueryServicePortInput = {
  activeOnly?: boolean
}

export type FindProductsQueryServicePortRow = {
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
}

export type FindProductsQueryServicePortOutput = {
  products: FindProductsQueryServicePortRow[]
}

export interface FindProductsQueryServicePort {
  handle(
    input: FindProductsQueryServicePortInput
  ): Promise<FindProductsQueryServicePortOutput>
}

export const FindProductsQueryServicePortToken = Symbol(
  "FindProductsQueryServicePort"
)
