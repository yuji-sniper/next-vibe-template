export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELED: "canceled",
  INCOMPLETE: "incomplete",
  INCOMPLETE_EXPIRED: "incomplete_expired",
  PAST_DUE: "past_due",
  TRIALING: "trialing",
  UNPAID: "unpaid",
  PAUSED: "paused"
} as const

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS]

export class Subscription {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly stripeSubscriptionId: string,
    public stripePriceId: string,
    public status: SubscriptionStatus,
    public currentPeriodStart: Date | null,
    public currentPeriodEnd: Date | null,
    public cancelAtPeriodEnd: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(params: {
    id: string
    customerId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status?: SubscriptionStatus
    currentPeriodStart?: Date | null
    currentPeriodEnd?: Date | null
    cancelAtPeriodEnd?: boolean
  }): Subscription {
    const now = new Date()
    return new Subscription(
      params.id,
      params.customerId,
      params.stripeSubscriptionId,
      params.stripePriceId,
      params.status ?? SUBSCRIPTION_STATUS.ACTIVE,
      params.currentPeriodStart ?? null,
      params.currentPeriodEnd ?? null,
      params.cancelAtPeriodEnd ?? false,
      now,
      now
    )
  }

  static reconstruct(params: {
    id: string
    customerId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: SubscriptionStatus
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    createdAt: Date
    updatedAt: Date
  }): Subscription {
    return new Subscription(
      params.id,
      params.customerId,
      params.stripeSubscriptionId,
      params.stripePriceId,
      params.status,
      params.currentPeriodStart,
      params.currentPeriodEnd,
      params.cancelAtPeriodEnd,
      params.createdAt,
      params.updatedAt
    )
  }

  updateStatus(status: SubscriptionStatus): void {
    this.status = status
    this.updatedAt = new Date()
  }

  updatePeriod(start: Date | null, end: Date | null): void {
    this.currentPeriodStart = start
    this.currentPeriodEnd = end
    this.updatedAt = new Date()
  }

  updatePriceId(priceId: string): void {
    this.stripePriceId = priceId
    this.updatedAt = new Date()
  }

  setCancelAtPeriodEnd(value: boolean): void {
    this.cancelAtPeriodEnd = value
    this.updatedAt = new Date()
  }

  cancel(): void {
    this.status = SUBSCRIPTION_STATUS.CANCELED
    this.updatedAt = new Date()
  }
}
