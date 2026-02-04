export type UpdateProductUseCaseInput = {
  productId: string
  name?: string
  description?: string
  active?: boolean
  features?: string[]
  displayOrder?: number
  metadata?: Record<string, string>
}

export type UpdateProductUseCaseOutput = {
  product: {
    id: string
    stripeProductId: string | null
    name: string
    description: string | null
    active: boolean
    features: string[] | null
    displayOrder: number
    metadata: Record<string, string> | null
    createdAt: Date
    updatedAt: Date
  }
}

export interface UpdateProductUseCasePort {
  handle(input: UpdateProductUseCaseInput): Promise<UpdateProductUseCaseOutput>
}

export const UpdateProductUseCasePortToken = Symbol("UpdateProductUseCasePort")
