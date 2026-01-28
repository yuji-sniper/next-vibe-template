export type PriceType = "one_time" | "recurring"
export type RecurringInterval = "month" | "year"

export class Price {
  private constructor(
    public readonly id: string,
    public readonly productId: string,
    public stripePriceId: string | null,
    public readonly currency: string,
    public readonly unitAmount: number,
    public readonly recurringInterval: RecurringInterval | null,
    public readonly recurringIntervalCount: number,
    public readonly type: PriceType,
    public active: boolean,
    public readonly metadata: Record<string, string> | null,
    public readonly displayName: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(params: {
    id: string
    productId: string
    currency?: string
    unitAmount: number
    recurringInterval?: RecurringInterval | null
    recurringIntervalCount?: number
    type: PriceType
    active?: boolean
    metadata?: Record<string, string> | null
    displayName?: string | null
  }): Price {
    const now = new Date()
    return new Price(
      params.id,
      params.productId,
      null,
      params.currency ?? "jpy",
      params.unitAmount,
      params.recurringInterval ?? null,
      params.recurringIntervalCount ?? 1,
      params.type,
      params.active ?? true,
      params.metadata ?? null,
      params.displayName ?? null,
      now,
      now
    )
  }

  static reconstruct(params: {
    id: string
    productId: string
    stripePriceId: string | null
    currency: string
    unitAmount: number
    recurringInterval: RecurringInterval | null
    recurringIntervalCount: number
    type: PriceType
    active: boolean
    metadata: Record<string, string> | null
    displayName: string | null
    createdAt: Date
    updatedAt: Date
  }): Price {
    return new Price(
      params.id,
      params.productId,
      params.stripePriceId,
      params.currency,
      params.unitAmount,
      params.recurringInterval,
      params.recurringIntervalCount,
      params.type,
      params.active,
      params.metadata,
      params.displayName,
      params.createdAt,
      params.updatedAt
    )
  }

  setStripePriceId(stripePriceId: string): void {
    this.stripePriceId = stripePriceId
    this.updatedAt = new Date()
  }

  archive(): void {
    this.active = false
    this.updatedAt = new Date()
  }

  get isRecurring(): boolean {
    return this.type === "recurring"
  }
}
