export type InvoiceStatus = "paid" | "open" | "void" | "uncollectible"

export type InvoiceHistoryItem = {
  id: string
  amount: number
  currency: string
  status: InvoiceStatus
  paidAt: string | null
  createdAt: string
}
