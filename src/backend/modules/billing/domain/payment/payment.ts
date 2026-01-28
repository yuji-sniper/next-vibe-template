export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  CANCELED: "canceled"
} as const

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export class Payment {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly stripePaymentIntentId: string,
    public readonly amount: number,
    public readonly currency: string,
    public status: PaymentStatus,
    public readonly createdAt: Date
  ) {}

  static create(params: {
    id: string
    customerId: string
    stripePaymentIntentId: string
    amount: number
    currency?: string
    status?: PaymentStatus
  }): Payment {
    return new Payment(
      params.id,
      params.customerId,
      params.stripePaymentIntentId,
      params.amount,
      params.currency ?? "jpy",
      params.status ?? PAYMENT_STATUS.PENDING,
      new Date()
    )
  }

  static reconstruct(params: {
    id: string
    customerId: string
    stripePaymentIntentId: string
    amount: number
    currency: string
    status: PaymentStatus
    createdAt: Date
  }): Payment {
    return new Payment(
      params.id,
      params.customerId,
      params.stripePaymentIntentId,
      params.amount,
      params.currency,
      params.status,
      params.createdAt
    )
  }

  updateStatus(status: PaymentStatus): void {
    this.status = status
  }
}
