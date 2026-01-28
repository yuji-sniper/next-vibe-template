export type CreateProductUseCaseInput = {
  name: string
  description?: string
  features?: string[]
  displayOrder?: number
  metadata?: Record<string, string>
}

export type CreateProductUseCaseOutput = {
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

export interface CreateProductUseCasePort {
  handle(input: CreateProductUseCaseInput): Promise<CreateProductUseCaseOutput>
}

export const CreateProductUseCasePortToken = Symbol("CreateProductUseCasePort")
