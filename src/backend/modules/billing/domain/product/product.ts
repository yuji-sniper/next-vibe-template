export class Product {
  private constructor(
    public readonly id: string,
    public stripeProductId: string | null,
    public name: string,
    public description: string | null,
    public active: boolean,
    public metadata: Record<string, string> | null,
    public displayOrder: number,
    public features: string[] | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(params: {
    id: string
    name: string
    description?: string | null
    active?: boolean
    metadata?: Record<string, string> | null
    displayOrder?: number
    features?: string[] | null
  }): Product {
    const now = new Date()
    return new Product(
      params.id,
      null,
      params.name,
      params.description ?? null,
      params.active ?? true,
      params.metadata ?? null,
      params.displayOrder ?? 0,
      params.features ?? null,
      now,
      now
    )
  }

  static reconstruct(params: {
    id: string
    stripeProductId: string | null
    name: string
    description: string | null
    active: boolean
    metadata: Record<string, string> | null
    displayOrder: number
    features: string[] | null
    createdAt: Date
    updatedAt: Date
  }): Product {
    return new Product(
      params.id,
      params.stripeProductId,
      params.name,
      params.description,
      params.active,
      params.metadata,
      params.displayOrder,
      params.features,
      params.createdAt,
      params.updatedAt
    )
  }

  setStripeProductId(stripeProductId: string): void {
    this.stripeProductId = stripeProductId
    this.updatedAt = new Date()
  }

  updateName(name: string): void {
    this.name = name
    this.updatedAt = new Date()
  }

  updateDescription(description: string | null): void {
    this.description = description
    this.updatedAt = new Date()
  }

  updateDisplayOrder(displayOrder: number): void {
    this.displayOrder = displayOrder
    this.updatedAt = new Date()
  }

  updateFeatures(features: string[] | null): void {
    this.features = features
    this.updatedAt = new Date()
  }

  updateMetadata(metadata: Record<string, string> | null): void {
    this.metadata = metadata
    this.updatedAt = new Date()
  }

  activate(): void {
    this.active = true
    this.updatedAt = new Date()
  }

  archive(): void {
    this.active = false
    this.updatedAt = new Date()
  }
}
