export const INVOICE_STATUS = {
  PAID: "paid",
  OPEN: "open",
  VOID: "void",
  UNCOLLECTIBLE: "uncollectible"
} as const

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS]

export class Invoice {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly subscriptionId: string | null,
    public readonly stripeInvoiceId: string,
    public readonly amount: number,
    public readonly currency: string,
    public status: InvoiceStatus,
    public paidAt: Date | null,
    public readonly createdAt: Date
  ) {}

  static create(params: {
    id: string
    customerId: string
    subscriptionId?: string | null
    stripeInvoiceId: string
    amount: number
    currency?: string
    status?: InvoiceStatus
    paidAt?: Date | null
  }): Invoice {
    return new Invoice(
      params.id,
      params.customerId,
      params.subscriptionId ?? null,
      params.stripeInvoiceId,
      params.amount,
      params.currency ?? "jpy",
      params.status ?? INVOICE_STATUS.OPEN,
      params.paidAt ?? null,
      new Date()
    )
  }

  static reconstruct(params: {
    id: string
    customerId: string
    subscriptionId: string | null
    stripeInvoiceId: string
    amount: number
    currency: string
    status: InvoiceStatus
    paidAt: Date | null
    createdAt: Date
  }): Invoice {
    return new Invoice(
      params.id,
      params.customerId,
      params.subscriptionId,
      params.stripeInvoiceId,
      params.amount,
      params.currency,
      params.status,
      params.paidAt,
      params.createdAt
    )
  }

  markAsPaid(paidAt: Date): void {
    this.status = INVOICE_STATUS.PAID
    this.paidAt = paidAt
  }

  markAsUncollectible(): void {
    this.status = INVOICE_STATUS.UNCOLLECTIBLE
  }

  markAsVoid(): void {
    this.status = INVOICE_STATUS.VOID
  }
}
